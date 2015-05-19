(function() {
'use strict';

/* venue view Controller */

app.controller('VenueViewController', ['$scope', '$http', '$state', '$log', '$stateParams','venuesService', function ($scope, $http, $state, $log, $stateParams, venuesService) {
        $scope.messageVenue = 'hello from venues VenuesViewController';
        $log.log($scope.messageVenue);
        $scope.selectedVenue = {};

        venuesService.find($stateParams.venueId).$promise.then(
            function (v) {
                $scope.selectedVenue = v;
            },
            function (err) {
                alert('error:' + err);
            }
        );

//        Venues.getById($stateParams.venueId).then(
//                function (v) {
//                    $scope.selectedVenue = v;
//                },
//                function (err) {
//                    alert('error:' + err);
//                }
//        );

    }]);
})();
