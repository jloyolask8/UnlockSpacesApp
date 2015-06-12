//(function() {
'use strict';

/* venue view Controller */

app.controller('BookingRequestsController', ['$scope', '$http', '$state', '$log', '$stateParams', 'reservationsService', function ($scope, $http, $state, $log, $stateParams, reservationsService) {
//        $scope.messageVenue = 'hello from YourListingsController';
//        $log.log($scope.messageVenue);
        
        $scope.reservations = {list: null};
        
        var reservations = reservationsService.findReservationsByAdminId();
        reservations.$promise.then(function (){
            //alert("reservations: "+reservations.length);
            $scope.reservations.list = reservations;
        });
        
        $scope.createDate = function (strDate){
            var dateArray = strDate.split(' ');
            var date = new Date(dateArray[1], dateArray[2], dateArray[5]);
            return date;
        };
        
    }]);
//})();
