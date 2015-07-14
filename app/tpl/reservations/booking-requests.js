//(function() {
'use strict';

/* venue view Controller */

app.controller('BookingRequestsController', function ($scope, $http, $state, $log, $stateParams, reservationsService, servicesUrls) {
//        $scope.messageVenue = 'hello from YourListingsController';
//        $log.log($scope.messageVenue);

    $scope.reservations = {list: null};
    $scope.selected = null;
    $scope.renderList = true;

    var reservations = reservationsService.findReservationsByAdminId();
    reservations.$promise.then(function () {
        //alert("reservations: "+reservations.length);
        $scope.reservations.list = reservations;
        if ($scope.reservations.list.length > 0) {
            $scope.selected = $scope.reservations.list[0];
        }
    });

    $scope.createDate = function (strDate) {
        var dateArray = strDate.split(' ');
        return dateArray[1] + " " + dateArray[2] + " " + dateArray[5]
    };

    $scope.selectReservation = function (reservation) {
        $scope.selected = reservation;
        $log.info("selected: " + $scope.selected.reservedBy.name + " " + $scope.selected.reservedBy.lastname);
    };

    $scope.isPending = function () {
        return ($scope.selected.reservationStatus.id === 'PENDING');
    };

    $scope.isAproved = function () {
        return ($scope.selected.reservationStatus.id === 'ACCEPTED');
    };

    $scope.getStatusStyle = function (reservation) {
        if (reservation.reservationStatus.id === 'ACCEPTED') {
            return "text-info";
        } else if (reservation.reservationStatus.id === 'PENDING') {
            return "text-primary";
        } else if (reservation.reservationStatus.id === 'CANCELED_BY_OWNER') {
            return "text-danger";
        }
    };



    $scope.rejectBooking = function () {
        $scope.selected.reservationStatus.id = 'REJECTED';
        editReservation();
    };

    $scope.approveBooking = function () {
        $scope.selected.reservationStatus.id = 'ACCEPTED';
        editReservation();
    };

    $scope.cancelBooking = function () {
        $scope.selected.reservationStatus.id = 'CANCELED_BY_OWNER';
        editReservation();
    };

    var editReservation = function () {
        $scope.renderList = false;
        $http.put(servicesUrls.baseUrl + 'reservations/' + $scope.selected.id, $scope.selected)
                .success(function (data, status, headers) {

                    $scope.headers = headers;
                    $scope.data = data;
                    $scope.status = status;

                    //$scope.showResponseModal(data);

                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    if (status === 0) {
                        alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                        return;
                    }

                });
        $scope.renderList = true;
    }

});
//})();
