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
    //$scope.newReservationObj = {startDateTime: new Date()};
    $scope.scoped = {format: 'HH:mm:ss'};
    $scope.vm = {dateTimeStartTime: '',
        dateTimeEndTime: ''}
    $scope.newReservationObj = {};
    $scope.dateTimeStartTime = '';
    $scope.loaded = false;

    $scope.dateOptions = {
        locale: 'es',
        daysOfWeekDisabled: [],
        useCurrent: true
    };

    $scope.durationObj = {};
    $scope.venueFee = {value: 0,
        tax: 0,
        total: 0};
    $scope.calculateStartTime = function (reservationObj) {
        var availability = true;
        if (reservationObj.space.venue.hoursOfOperation) {
            availability = (reservationObj.space.venue.hoursOfOperation[$scope.days[reservationObj.startDateTime.getDay()]]);
        }
        if (availability) {
            if (availability.availabilityOption === 'true') {
                var startTimeParts = availability.startTime.split(':');
                var ampm = startTimeParts[1].split(' ');
                var hour = parseInt(startTimeParts[0]) + ((ampm[1] === "PM") ? 12 : 0);
                reservationObj.startDateTime.setHours(hour);
                reservationObj.startDateTime.setMinutes(parseInt(ampm[0]));
                $scope.vm.dateTimeStartTime = reservationObj.startDateTime.getDate() + '/' +
                        (reservationObj.startDateTime.getMonth() + 1) + '/' + reservationObj.startDateTime.getFullYear() +
                        ' ' + reservationObj.startDateTime.getHours() + ':' + reservationObj.startDateTime.getMinutes();
//                $scope.dateTimeStartTime = moment();
            }
        }

    };

    this.loadParams = function () {
        $scope.newReservationObj = {};
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
                        calculatePrice();

                        if ($scope.newReservationObj.space.venue.hoursOfOperation) {
                            for (var day = 0; day < 7; day++) {
                                if (($scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[day]])) {
                                    if (($scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[day]]).availabilityOption !== 'true') {
                                        $scope.dateOptions.daysOfWeekDisabled.push(day);
                                    }
                                } else {
                                    $scope.dateOptions.daysOfWeekDisabled.push(day);
                                }
                            }
                        }
                        $scope.calculateStartTime($scope.newReservationObj);
                        $scope.loaded = true;
                        //$scope.$apply();

                        $scope.disabled.method = function (date, mode) {
                            if ($scope.newReservationObj.space) {
                                //console.log("day:" + $scope.days[date.getDay()] + ": " + ($scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[date.getDay()]]));
                                if (!$scope.newReservationObj.space.venue.hoursOfOperation)
                                    return false;
                                var infoDay = $scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[date.getDay()]];
                                var availableDay = (infoDay) && (infoDay.availabilityOption === 'true');
                                return (mode === 'day' && !availableDay);
                            }
                            return true;
                        };
                    },
                    function (err) {
                        alert('error:' + err);
                    }
            );
        }
    };

    this.loadParams();

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    };

    function isValidDate(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]")
            return false;
        return !isNaN(d.getTime());
    }

    Date.prototype.getDaysInMonth = function () {
        if (isValidDate(this)) {
            return new Date(Date.UTC(this.getYear(), this.getMonth() + 1, 0)).getUTCDate();
        } else {
            return 0;
        }
    };

    Date.prototype.addMonths = function (value) {
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        var daysInMonth = this.getDaysInMonth();
        this.setDate(Math.min(n, daysInMonth));
        return this;
    };

    $scope.days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


    //$scope.initDate = $scope.newReservationObj.startDateTime;
    //$scope.mytime = new Date();



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

    $scope.$watch('durationObj', function (newvar, oldvar) {
        console.log("durationObj oldvar:" + oldvar + " newvar:" + newvar);
        calculatePrice();
        calculateEndTime();
        $scope.newReservationObj.duration = parseInt($scope.durationObj.duration) || 0;
        $scope.newReservationObj.durationUnit = $scope.durationObj.durationUnit;
    }, true);

    var calculatePrice = function () {
        if ($scope.newReservationObj.space) {
            var tarifaBase = 0;
            if ($scope.durationObj.durationUnit === 'Hours') {
                tarifaBase = parseFloat($scope.newReservationObj.space.pricing.perHour);
            } else if ($scope.durationObj.durationUnit === 'Months') {
                tarifaBase = parseFloat($scope.newReservationObj.space.pricing.perMonth);
            } else {
                tarifaBase = parseFloat($scope.newReservationObj.space.pricing.perDay);
            }
            $scope.venueFee.value = tarifaBase * $scope.durationObj.duration;
            $scope.venueFee.tax = $scope.venueFee.value * ($scope.newReservationObj.space.pricing.tax / 100);
            $scope.venueFee.total = $scope.venueFee.tax + $scope.venueFee.value;
            $scope.newReservationObj.paymentAmount = $scope.venueFee.value;
            $scope.newReservationObj.paymentVat = $scope.venueFee.tax;
        }
    };

    $scope.$watch('newReservationObj.startDateTime', function (newvar, oldvar) {
        console.log("startDateTime oldvar:" + oldvar + " startDateTime newvar:" + newvar);
    }, true);

    $scope.$watch('vm.dateTimeStartTime', function (newvar, oldvar) {
        var datetime = newvar.split(' ');
        var date = datetime[0].split('/');
        var time = datetime[1].split(':');
        var dateVar = new Date(date[1] + '/' + date[0] + '/' + date[2]);
        dateVar.setHours(time[0]);
        dateVar.setMinutes(time[1]);

        console.log("dateTimeStartTime oldvar:" + oldvar + " dateTimeStartTime newvar:" + dateVar.toString());
        $scope.newReservationObj.startDateTime = dateVar;
        calculateEndTime();
    }, true);

    $scope.clear = function () {
        $scope.newReservationObj.startDateTime = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
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

//        modalInstance.result.then(function (selectedItem) {
//            console.info(selectedItem);
//        }, function () {
//            console.info('Modal dismissed at: ' + new Date());
//        });
    };

    console.log('hello from BookingController');

    var calculateEndTime = function () {
        
        var duration = parseInt($scope.durationObj.duration) || 0;
        
        $scope.newReservationObj.endDateTime = new Date($scope.newReservationObj.startDateTime);
        var adjustEndHour = false;
        if ($scope.durationObj.durationUnit === 'Hours') {
            var newEndTime = new Date($scope.newReservationObj.endDateTime);
            newEndTime.addHours(duration);
            if (newEndTime.getDate() === $scope.newReservationObj.endDateTime.getDate()) {
                $scope.newReservationObj.endDateTime = newEndTime;
            } else {
                adjustEndHour = true;
            }
        } else if ($scope.durationObj.durationUnit === 'Months') {
            $scope.newReservationObj.endDateTime.addMonths(duration);
            $scope.newReservationObj.endDateTime.setDate($scope.newReservationObj.startDateTime.getDate() - 1);
            adjustEndHour = true;
        } else {
            $scope.newReservationObj.endDateTime.setDate($scope.newReservationObj.startDateTime.getDate() + (duration - 1));
            adjustEndHour = true;
        }
        //verifica si el endTime esta en un dia no disponible
        while ($scope.disabled.method($scope.newReservationObj.endDateTime, 'day')) {
            $scope.newReservationObj.endDateTime.setDate($scope.newReservationObj.endDateTime.getDate() + 1);
        }
        //Ajusta la hora de termino
        if (adjustEndHour) {
            var infoDay = $scope.newReservationObj.space.venue.hoursOfOperation[$scope.days[$scope.newReservationObj.endDateTime.getDay()]];
            console.info("infoDay: " + infoDay);
            var startTimeParts = infoDay.endTime.split(':');
            var ampm = startTimeParts[1].split(' ');
            var hour = parseInt(startTimeParts[0]) + ((ampm[1] === "PM") ? 12 : 0);
            $scope.newReservationObj.endDateTime.setHours(hour);
            $scope.newReservationObj.endDateTime.setMinutes(parseInt(ampm[0]));
        }
        $scope.vm.dateTimeEndTime = $scope.newReservationObj.endDateTime.getDate() + '/' +
                ($scope.newReservationObj.endDateTime.getMonth() + 1) + '/' + $scope.newReservationObj.endDateTime.getFullYear() +
                ' ' + $scope.newReservationObj.endDateTime.getHours() + ':' + $scope.newReservationObj.endDateTime.getMinutes();
        console.info("endTime: " + $scope.newReservationObj.endDateTime.toString());

    }

    function createReservation() {


        $scope.newReservationObj.paymentStatus = "PAID";

//        $scope.newReservationObj.reservationStatus = {
//            name: "PENDING",
//            details: "is waiting for your approval",
//            id: "1"
//        };


        $http.post(servicesUrls.baseUrl + 'reservations', $scope.newReservationObj)
                .success(function (data, status, headers) {

                    $scope.headers = headers;
                    $scope.data = data;
                    $scope.status = status;

$state.go("app.dashboard");
                    $scope.showResponseModal(data);

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



});


