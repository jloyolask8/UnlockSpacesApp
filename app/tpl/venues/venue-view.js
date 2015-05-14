(function() {
'use strict';

/* venue view Controller */

app.controller('VenueViewController', ['$scope', '$http', '$state', '$log', '$stateParams','Venues', function ($scope, $http, $state, $log, $stateParams, Venues) {
        $scope.messageVenue = 'hello from venues VenuesViewController';
        $log.log($scope.messageVenue);
        $scope.selectedVenue = {};


        Venues.getById($stateParams.venueId).then(
                function (v) {
                    $scope.selectedVenue = v;
                },
                function (err) {
                    alert('error:' + err);
                }
        );

    }]);
})();
