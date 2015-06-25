//(function() {
'use strict';

/* venue view Controller */

app.controller('SpaceViewController', 
['$scope', '$http', '$state', '$log', '$stateParams', 'spacesService', 
    function ($scope, $http, $state, $log, $stateParams, spacesService) {
        $scope.message = 'hello from SpaceViewController';
        $log.log($scope.message);

        $scope.selected = null;
        $scope.markers = [{
                color: 'blue',
                label: 'S',
                coords: [-33.4076, -70.5697]
            }];

        spacesService.findById($stateParams.spaceId).$promise.then(
                function (space) {
                    $scope.selected = space;
                    $scope.markers = [{
                            color: 'blue',
                            label: 'S',
                            coords: [parseFloat($scope.selected.venue.address.latitude), parseFloat($scope.selected.venue.address.longitude)]
                        }];
                    createImageSlides($scope.selected);
                },
                function (err) {
                    alert('error:' + err);
                }
        );

        var createImageSlides = function (space) {
            space.slides = [];
            if (space.photos) {
                space.photos.forEach(function (photourl) {
                    space.slides.push({
                        image: photourl
                    });
                });
            }
        };

        $scope.$watch('markers', function (newval, oldval) {
            $log.info("newval: " + newval);
            $log.info("oldval: " + oldval);
        });

    }]);
