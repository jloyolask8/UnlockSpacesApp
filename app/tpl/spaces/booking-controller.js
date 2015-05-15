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

    $scope.initDate = new Date();
    $scope.format = 'yyyy/MM/dd HH:mm';

    $scope.selectedSpace = {};
    //space/venue type

    $scope.createReservation = createReservation;

    $scope.newReservationObj = {};

    $scope.cancelBooking = function () {
        $state.go("app.venues.list");
    };

    loadParams();




    $scope.clear = function () {
        $scope.newReservationObj.startDateTime = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
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
            $scope.newReservationObj.startDateTime = $stateParams.dateSelected;
        } else {
            $scope.newReservationObj.startDateTime = new Date();
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


