//(function() {
'use strict';

/* venue view Controller */

app.controller('VenueViewController', ['$scope', '$http', '$state', '$log', '$stateParams', 'venuesService', function ($scope, $http, $state, $log, $stateParams, venuesService) {
        $scope.messageVenue = 'hello from venues VenuesViewController';
        $log.log($scope.messageVenue);
        $scope.selectedVenue = {};

        venuesService.find($stateParams.venueId).$promise.then(
                function (v) {
                    $scope.selectedVenue = v;
                    createVenueSlides($scope.selectedVenue);
                },
                function (err) {
                    alert('error:' + err);
                }
        );

        var createVenueSlides = function (venue) {
            venue.slides = [];
            if (venue.photos) {
                venue.photos.forEach(function (photourl) {
                    venue.slides.push({
                        image: photourl
                    });
                });
            }
        };

    }]);
//})();
