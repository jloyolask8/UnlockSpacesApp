//(function() {
'use strict';

/* venue view Controller */

app.controller('VenueViewController', ['$scope', '$http', '$state', '$log', '$stateParams', 'venuesService', function ($scope, $http, $state, $log, $stateParams, venuesService) {
        $scope.messageVenue = 'hello from venues VenuesViewController';
        $log.log($scope.messageVenue);
        $scope.selectedVenue = null;
        $scope.markers = [{
                            color: 'blue',
                            label: 'S',
                            coords: [-33.4076, -70.5697]
                        }];

        venuesService.find($stateParams.venueId).$promise.then(
                function (v) {
                    $scope.selectedVenue = v;
                    $scope.markers = [{
                            color: 'blue',
                            label: 'S',
                            coords: [parseFloat($scope.selectedVenue.address.latitude), parseFloat($scope.selectedVenue.address.longitude)]
                        }];
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

        $scope.$watch('markers',function(newval,oldval){
            $log.info("newval: "+newval);
            $log.info("oldval: "+oldval);
        });

    }]);
//})();
