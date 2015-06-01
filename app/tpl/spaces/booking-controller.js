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

    $scope.newReservationObj = {};
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
    if(hours < 8){
        hours = 8;
    }
    $scope.newReservationObj.startDateTime.setHours(hours);
    $scope.newReservationObj.startDateTime.setMinutes(minutes);

    $scope.hstep = 1;
    $scope.mstep = 30;

    $scope.ismeridian = (hours > 12);
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.changedTime = function () {
        console.log('Time changed to: ' + $scope.newReservationObj.startDateTime);
    };

    $scope.selectedSpace = {};
    //space/venue type

    $scope.createReservation = createReservation;


    $scope.cancelBooking = function () {
        $state.go("app.venues.list");
    };

// Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

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
        
        var endTime = $scope.$scope.newReservationObj

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
            $scope.newReservationObj.duration = $stateParams.duration;
        } else {
            $scope.newReservationObj.duration = 1;
        }
        
        if ($stateParams.duration) {
            $scope.newReservationObj.duration = $stateParams.duration;
        } else {
            $scope.newReservationObj.duration = 1;
        }
        
        if ($stateParams.durationUnit) {
            $scope.newReservationObj.durationUnit = $stateParams.duration;
        } else {
            $scope.newReservationObj.durationUnit = 'Days';
        }

        if ($stateParams.spaceId) {
            SpacesRS.getById($stateParams.spaceId).then(
                    function (v) {
                        $scope.newReservationObj.space = v;
                    },
                    function (err) {
                        alert('error:' + err);
                    }
            );
        }
    }

});


