'use strict';

/* Controllers */
// signin controller

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'headers', 'data', 'status', function ($scope, $modalInstance, headers, data, status) {
        $scope.headers = headers;
        $scope.status = status;
        $scope.data = data;

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
        ;

app.controller('BookingController', function (servicesUrls, $http, $modal, $scope, $state, $location, $stateParams, SpacesRS) {

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    };

    Date.prototype.addMonths = function (value) {
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };

    $scope.days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    $scope.newReservationObj = {};
    $scope.durationObj = {};
    loadParams();
    //$scope.initDate = $scope.newReservationObj.startDateTime;
    //$scope.mytime = new Date();

    var hours = $scope.newReservationObj.startDateTime.getHours();
    var minutes = $scope.newReservationObj.startDateTime.getMinutes();
    if (minutes > 30) {
        minutes = 0;
        hours += 1;
        if (hours > 23) {
            hours = 0;
            $scope.newReservationObj.startDateTime.setDate($scope.newReservationObj.startDateTime.getDate() + 1);
        }
    } else {
        minutes = 30;
    }
    if (hours < 8) {
        hours = 8;
    }
    $scope.newReservationObj.startDateTime.setHours(hours);
    $scope.newReservationObj.startDateTime.setMinutes(minutes);

    $scope.hstep = 1;
    $scope.mstep = 30;

    $scope.changedTime = function () {
        console.log('Time changed to: ' + $scope.newReservationObj.startDateTime);
    };
    
    $scope.disabled = {};

    $scope.selectedSpace = {};
    //space/venue type

    $scope.createReservation = createReservation;


    $scope.cancelBooking = function () {
        $state.go("app.yourlistings");
    };

// Disable weekend selection

    $scope.$watch('newReservationObj.startDateTime', function (newvar, oldvar) {
        console.log("oldvar:" + oldvar + " newvar:" + newvar);
    });

    $scope.clear = function () {
        $scope.newReservationObj.startDateTime = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        //formatYear: 'dd-MMMM-yyyy',
        mindate: new Date(),
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };


    $scope.showResponseModal = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/blocks/helpers/httpResponse.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                headers: function () {
                    return $scope.headers;
                },
                data: function () {
                    return $scope.data;
                },
                status: function () {
                    return $scope.status;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.info(selectedItem);
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    console.log('hello from BookingController');

    function createReservation() {

        $scope.newReservationObj.endDateTime = new Date($scope.newReservationObj.startDateTime);

        if ($scope.durationObj.durationUnit === 'Hours') {
            $scope.newReservationObj.endDateTime.addHours($scope.durationObj.duration);
        } else if ($scope.durationObj.durationUnit === 'Months') {
            $scope.newReservationObj.endDateTime.addMonths($scope.durationObj.duration);
        } else {
            $scope.newReservationObj.endDateTime.setDate($scope.newReservationObj.startDateTime.getDate() + $scope.durationObj.duration);
        }



        $http.post(servicesUrls.baseUrl + 'reservations', $scope.newReservationObj)
                .success(function (data, status, headers) {

                    $scope.headers = headers;
                    $scope.data = data;
                    $scope.status = status;

                    $scope.showResponseModal();

                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    if (status === 0) {
                        alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                        return;
                    }

                });

    }

    function loadParams() {
        if ($stateParams.dateSelected) {
            $scope.newReservationObj.startDateTime = new Date($stateParams.dateSelected);
        } else {
            $scope.newReservationObj.startDateTime = new Date();
        }
        if ($stateParams.duration) {
            $scope.durationObj.duration = $stateParams.duration;
        } else {
            $scope.durationObj.duration = 1;
        }

        if ($stateParams.duration) {
            $scope.durationObj.duration = $stateParams.duration;
        } else {
            $scope.durationObj.duration = 1;
        }

        if ($stateParams.durationUnit) {
            $scope.durationObj.durationUnit = $stateParams.duration;
        } else {
            $scope.durationObj.durationUnit = 'Days';
        }

        if ($stateParams.spaceId) {
            SpacesRS.getById($stateParams.spaceId).then(
                    function (v) {
                        $scope.newReservationObj.space = v;
                        $scope.disabled.method = function (date, mode) {
                            if ($scope.newReservationObj.space) {
                                console.log("day:" + $scope.days[date.getDay()] + ": " + ($scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[date.getDay()]]));
                                return (mode === 'day' && !($scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[date.getDay()]]));
                            }
                            return true;
                        };
                    },
                    function (err) {
                        alert('error:' + err);
                    }
            );
        }
    }

});


