(function () {

    var mapControllers = angular.module('mapControllers', ['uiGmapgoogle-maps', 'ngResource', 'spacesRestClient']);
    mapControllers.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization,places'
        });
    });

    mapControllers.controller("MapController", function ($scope, $log, uiGmapGoogleMapApi, spacesService) {

        var iconimg = {
            url: './img/Map-Marker-Marker-Outside-Chartreuse-icon.png', //'https://www.sharedesk.net/images/map/cluster_on.svg', // url
            //scaledSize: new google.maps.Size(48, 48), // size
        };
        var iconimghightlight = {
            url: './img/Map-Marker-Marker-Outside-Pink-icon.png', //'https://www.sharedesk.net/images/map/cluster_on.svg', // url
            //scaledSize: new google.maps.Size(48, 48), // size
        };
        /**
         * flag para agregar componentes en la primera carga del mapa
         * @type Boolean|Boolean
         */
        var firstTime = true;
        /**
         * lista que contiene localmente los spaces devueltos por el backend
         * @type Array|@exp;spacesService@call;geoSearch
         */
        var spacesList = [];

        /**
         * input busqueda de lugares en el mapa
         * @type google.maps.places.SearchBox
         */
        var searchBox = null;

        /**
         * Expone a nivel de scope los spaces recuperados desde el backend
         */
        $scope.spaces = [];

        /**
         * Expone a nivel de scope los markers creados a partir de los spaces recuperados
         */
        $scope.markers = [];

        $scope.mapInstance = null;

        $scope.optionsModel = {
            centerOnMap: true,
        };
        /**
         * Una vez que el api de google está cargada,
         * se definen los parametros y suscripciones a eventos
         */
        uiGmapGoogleMapApi.then(function (maps) {
            setMapValues(maps);
        });

        var setMapValues = function (map) {
            $scope.map = {
                windowTemplate: "tpl/blocks/venue-small-window.html",
                windowParameter: function (marker) {
                    return marker;
                },
                center: {latitude: -33.407550, longitude: -70.570209}, zoom: 13,
                options: {maxZoom: 16, minZoom: 13},
                events: {
                    dragend: function (map) {
                        $scope.$apply(function () {
                            loadSpaceMarkers(map);
                        });
                    },
                    bounds_changed: function (map) {
                        var bounds = map.getBounds();
                        if (searchBox !== null) {
                            searchBox.setBounds(bounds);
                        }
                    },
                    zoom_changed: function (map) {
                        $scope.$apply(function () {
                            loadSpaceMarkers(map);
                        });
                    },
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            if (firstTime) {
                                $log.info("firstTime");
                                loadSearchBar(map);
                                loadSpaceMarkers(map);
                                $scope.mapInstance = map;
                                firstTime = false;
                            }
                        });
                    }
                },
                infoWindowWithCustomClass: {
                    coords: {
                        latitude: 36.270850,
                        longitude: -44.296875
                    },
                    options: {
                        boxClass: 'custom-info-window',
                        closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
                        disableAutoPan: true
                    },
                    show: true
                }
            };
        };

        var loadSearchBar = function (map) {
            var input = (document.getElementById('pac-input'));
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            searchBox = new google.maps.places.SearchBox((input));
            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                map.panTo(places[0].geometry.location);
                loadSpaceMarkers(map);
            });

            var input = (document.getElementById('opciones'));
            map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(input);
        };

        var loadSpaceMarkers = function (map) {
//            $log.info("loadSpaceMarkers");
            //$scope.markers = [];
            var radio = calcRadio(map);
            var center = map.getCenter();
            spacesList = spacesService.geoSearch(center.lat(), center.lng(), radio);
            spacesList.$promise.then(function () {
                refreshMapMarkers();
//                $log.info("markers length:" + $scope.markers.length);
            });
        };

        var compareSpace = function (a, b) {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            return 0;
        };

        $scope.spacesIsEmpty = function () {
            var retorno = ($scope.spaces.length === 0);
            //$log.info("spacesIsEmpty:"+retorno);
            return retorno;
        };

        var refreshMapMarkers = function () {
            var tempmarkers = [];
            $scope.spaces = [];
            spacesList.sort(compareSpace);
            for (var i = 0; i < spacesList.length; i++) {
                tempmarkers.push(createMarker(spacesList[i]));
                $scope.spaces.push(spacesList[i]);
            }
            var i = 0;
            while (i < $scope.markers.length) {
                var index = markerIndexOf(tempmarkers, $scope.markers[i]);
                if (index < 0) {
//                    $log.info("elimino el " + i);
                    $scope.markers.splice(i, 1);
                } else {
                    i++;
                }
            }
            i = 0;
            while (i < tempmarkers.length) {
                var index = markerIndexOf($scope.markers, tempmarkers[i]);
                if (index < 0) {
//                    $log.info("agrego el " + i);
                    $scope.markers.push(tempmarkers[i]);
                }
                i++;
            }
        };
        var calcRadio = function (map) {
            var bounds = map.getBounds();
            var NE = bounds.getNorthEast();
            var SW = bounds.getSouthWest();
            var horizontalLatLng1 = new google.maps.LatLng(NE.lat(), NE.lng());
            var horizontalLatLng2 = new google.maps.LatLng(NE.lat(), SW.lng());
            var verticalLatLng1 = new google.maps.LatLng(NE.lat(), NE.lng());
            var verticalLatLng2 = new google.maps.LatLng(SW.lat(), NE.lng());
            var horizontal = google.maps.geometry.spherical.computeDistanceBetween(horizontalLatLng1, horizontalLatLng2);
            var vertical = google.maps.geometry.spherical.computeDistanceBetween(verticalLatLng1, verticalLatLng2);
            return Math.round(((horizontal > vertical) ? horizontal : vertical) / 2);
        };
        var createMarker = function (space) {


            var markerProps = {
                coordinates: {
                    latitude: space.address.latitude,
                    longitude: space.address.longitude
                },
                title: space.overview.title,
                id: space.id,
                show: false,
                distance: ((space.distance > 1000) ? (Number((space.distance / 1000).toFixed(1)) + " Kms") : (Number((space.distance).toFixed(1)) + " Mts")),
                icon: iconimg,
                opciones: {
                    labelAnchor: (('' + space.id).length * 4) + " 32",
                    labelClass: "labelClass",
                    labelInBackground: true
                }
            };
            return markerProps;
        };
        var markerIndexOf = function (arr, value) {
            var a;
            for (var i = 0, iLen = arr.length; i < iLen; i++) {
                a = arr[i];
                if (a.id === value.id)
                    return i;
            }
            return -1;
        };

        $scope.highlightMarker = function (space) {
            var index = markerIndexOf($scope.markers, space);
            var marker = $scope.markers[index];
            marker.icon = iconimghightlight;
            if ($scope.optionsModel.centerOnMap) {
                $scope.mapInstance.panTo({lat: parseFloat(space.address.latitude), lng: parseFloat(space.address.longitude)});
            }
        };

        $scope.normalizeMarker = function (space) {
            var index = markerIndexOf($scope.markers, space);
            var marker = $scope.markers[index];
            marker.icon = iconimg;
        };

        $scope.markerClick = function (marker) {
            if (marker.show) {
                marker.show = false;
            } else {
                _.forEach($scope.markers, function (curMarker) {
                    curMarker.show = false;
                });
                marker.show = true;
            }
        };
        $scope.markerClose = function (marker) {
            marker.show = false;
        };
    });
    //Controller para manejar el template de la ventanita que se muestra en un marker del mapa.
    mapControllers.controller("winTemplateCtrl", ["$scope", function ($scope) {
        }]);

    mapControllers.directive('ngAutocomplete', function (uiGmapGoogleMapApi) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                options: '=?',
                details: '=?'
            },
            link: function (scope, element, attrs, controller) {

                //options for autocomplete
                var opts
                var watchEnter = false
                var libraryReady = false
                //convert options provided to opts
                var initOpts = function () {
                    if (libraryReady) {
                        opts = {}
                        if (scope.options) {

                            if (scope.options.watchEnter !== true) {
                                watchEnter = false
                            } else {
                                watchEnter = true
                            }

                            if (scope.options.types) {
                                opts.types = []
                                opts.types.push(scope.options.types)
                                scope.gPlace.setTypes(opts.types)
                            } else {
                                scope.gPlace.setTypes([])
                            }

                            if (scope.options.bounds) {
                                opts.bounds = scope.options.bounds
                                scope.gPlace.setBounds(opts.bounds)
                            } else {
                                scope.gPlace.setBounds(null)
                            }

                            if (scope.options.country) {
                                opts.componentRestrictions = {
                                    country: scope.options.country
                                }
                                scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
                            } else {
                                scope.gPlace.setComponentRestrictions(null)
                            }
                        }
                    }
                }

                uiGmapGoogleMapApi.then(function (maps) {
                    executeAfterLoadLibrary();
                    libraryReady = true;
                    initOpts();
                });

                var executeAfterLoadLibrary = function () {
                    if (scope.gPlace == undefined) {
                        scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
                    }
                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        var result = scope.gPlace.getPlace();
                        if (result !== undefined) {
                            if (result.address_components !== undefined) {

                                scope.$apply(function () {

                                    scope.details = result;

                                    controller.$setViewValue(element.val());
                                });
                            }
                            else {
                                if (watchEnter) {
                                    getPlace(result)
                                }
                            }
                        }
                    });
                }

                //function to get retrieve the autocompletes first result using the AutocompleteService 
                var getPlace = function (result) {
                    var autocompleteService = new google.maps.places.AutocompleteService();
                    if (result.name.length > 0) {
                        autocompleteService.getPlacePredictions(
                                {
                                    input: result.name,
                                    offset: result.name.length
                                },
                        function listentoresult(list, status) {
                            if (list == null || list.length == 0) {

                                scope.$apply(function () {
                                    scope.details = null;
                                });

                            } else {
                                var placesService = new google.maps.places.PlacesService(element[0]);
                                placesService.getDetails(
                                        {'reference': list[0].reference},
                                function detailsresult(detailsResult, placesServiceStatus) {

                                    if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                                        scope.$apply(function () {

                                            controller.$setViewValue(detailsResult.formatted_address);
                                            element.val(detailsResult.formatted_address);

                                            scope.details = detailsResult;

                                            //on focusout the value reverts, need to set it again.
                                            var watchFocusOut = element.on('focusout', function (event) {
                                                element.val(detailsResult.formatted_address);
                                                element.unbind('focusout')
                                            })

                                        });
                                    }
                                }
                                );
                            }
                        });
                    }
                }

                controller.$render = function () {
                    var location = controller.$viewValue;
                    element.val(location);
                };

                //watch options provided to directive
                scope.watchOptions = function () {
                    return scope.options
                };
                scope.$watch(scope.watchOptions, function () {
                    initOpts()
                }, true);

            }
        };
    });
})();