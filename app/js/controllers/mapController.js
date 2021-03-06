(function () {

    var mapControllers = angular.module('mapControllers', ['uiGmapgoogle-maps', 'ngResource', 'spacesRestClient']);
    mapControllers.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization,places'
        });
    });

    mapControllers.controller("MapController", function ($scope, $log, uiGmapGoogleMapApi, venuesService, $stateParams) {

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

        $scope.venuesSearchText = '';
        $scope.days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        var firstTime = true;
        var venuesList = [];
        var searchBox = null;

        $scope.filterSpaceSearch = {
            spaceType: '',
            durationUnit: '',
            duration: '1',
            date: ''
        };

        $scope.vm = {dateTimeStartTime: '',
            dateTimeEndTime: ''};

        $scope.$watch('filterSpaceSearch', function (newvar, oldvar) {
            $scope.calculateEndDay();
        }, true);

        $scope.calculateEndDay = function () {
            var duration = parseInt($scope.filterSpaceSearch.duration) || 0;
            $scope.vm.dateTimeEndTime = new Date($scope.dt);
            if ($scope.filterSpaceSearch.durationUnit === 'Hours') {
                $scope.vm.dateTimeEndTime.addHours(duration);
            } else if ($scope.filterSpaceSearch.durationUnit === 'Months') {
                $scope.vm.dateTimeEndTime.addMonths(duration);
                //$scope.filterSpaceSearch.dateTimeEndTime.setDate($scope.newReservationObj.startDateTime.getDate() - 1);
//                adjustEndHour = true;
            } else {
                var dateVar = $scope.vm.dateTimeEndTime.getDate();
                $scope.vm.dateTimeEndTime.setDate(dateVar + (duration - 1));
            }
            console.log("dateTimeEndTime: " + $scope.vm.dateTimeEndTime);
            searchVenuesOnMapBound(null);
        };

        $scope.dateOptions = {
            locale: 'es',
            daysOfWeekDisabled: [],
            useCurrent: true,
            minDate: new Date()
        };

        $scope.today = function () {
            $scope.dt = new Date();
            $scope.dt.setDate($scope.dt.getDate() + 1);
            $scope.dt.setHours(9);
            $scope.dt.setMinutes(0);
            $scope.vm.dateTimeStartTime = $scope.dt.getDate() + '/' +
                    ($scope.dt.getMonth() + 1) + '/' + $scope.dt.getFullYear() +
                    ' ' + $scope.dt.getHours() + ':' + $scope.dt.getMinutes();
            $scope.loaded = true;
        };
        $scope.today();

        $scope.$watch('vm.dateTimeStartTime', function (newvar, oldvar) {
            var datetime = newvar.split(' ');
            var date = datetime[0].split('/');
            var time = datetime[1].split(':');
            var dateVar = new Date(date[1] + '/' + date[0] + '/' + date[2]);
            dateVar.setHours(time[0]);
            dateVar.setMinutes(time[1]);

            console.log("dateTimeStartTime oldvar:" + oldvar + " dateTimeStartTime newvar:" + dateVar.toString());
            $scope.dt = dateVar;
            $scope.calculateEndDay();
        }, true);

        $scope.evalShowVenue = function (venue, from) {
            var ret = true;
            var spacesToShow = venue.spaces.length;
            if ((venue.spaces) && (venue.spaces.length > 0)) {
                if (venue.hoursOfOperation) {
                    var infoDay = venue.hoursOfOperation[$scope.days[$scope.dt.getDay()]];
                    ret = (infoDay) && (infoDay.availabilityOption === 'true');
                }
                for (var i = 0; i < venue.spaces.length; i++) {
                    if (!$scope.evalShowSpace(venue.spaces[i])) {
                        spacesToShow--;
                    }
                }
                if (spacesToShow === 0) {
                    ret = false;
                }
                //console.log("evalShowVenue venue id:" + venue.overview.title + " from: " + from + " ret:" + ret);
//                if (venue.overview.title === "minee") {
//                    console.log("evalShowVenue venue id:" + venue.overview.title + " from: " + from + " ret:" + ret);
//                }
                return ret;
            }
            return false;
        };

        $scope.evalShowSpace = function (space) {
            var ret = true;
            if (($scope.filterSpaceSearch.spaceType === null) || ($scope.filterSpaceSearch.spaceType === ''))
                return true;
            if (space.type) {
                if ($scope.filterSpaceSearch.spaceType === 'Work')
                {
                    return ((space.type.id === '1') || (space.type.id === '2'));
                } else {
                    return (space.type.id === '3');
                }
            } else {
                return false;
            }
            return ret;
        };

        Date.prototype.formatMMDDYYYY = function () {
            return (this.getMonth() + 1) +
                    "-" + this.getDate() +
                    "-" + this.getFullYear();
        };

        $scope.datePickerOptions = {
            position: {left: "-120px"},
            mindate: new Date()
        };

        $scope.iconimg = {};
        $scope.iconimghightlight = {};

        $scope.venues = [];
        $scope.markers = [];
        $scope.detailView = ($stateParams.details) ? ($stateParams.details === 'true') : false;

        $scope.formattedAddress = "";
        $scope.mapInstance = null;
        $scope.optionsModel = {
            centerOnMap: true,
        };

        $scope.styleMapFlat = [{"featureType": "water", "elementType": "all", "stylers": [{"hue": "#7fc8ed"}, {"saturation": 55}, {"lightness": -6}, {"visibility": "on"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"hue": "#7fc8ed"}, {"saturation": 55}, {"lightness": -6}, {"visibility": "off"}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"hue": "#83cead"}, {"saturation": 1}, {"lightness": -15}, {"visibility": "on"}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"hue": "#f3f4f4"}, {"saturation": -84}, {"lightness": 59}, {"visibility": "on"}]}, {"featureType": "landscape", "elementType": "labels", "stylers": [{"hue": "#ffffff"}, {"saturation": -100}, {"lightness": 100}, {"visibility": "off"}]}, {"featureType": "road", "elementType": "geometry", "stylers": [{"hue": "#ffffff"}, {"saturation": -100}, {"lightness": 100}, {"visibility": "on"}]}, {"featureType": "road", "elementType": "labels", "stylers": [{"hue": "#bbbbbb"}, {"saturation": -100}, {"lightness": 26}, {"visibility": "on"}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"hue": "#ffcc00"}, {"saturation": 100}, {"lightness": -35}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"hue": "#ffcc00"}, {"saturation": 100}, {"lightness": -22}, {"visibility": "on"}]}, {"featureType": "poi.school", "elementType": "all", "stylers": [{"hue": "#d7e4e4"}, {"saturation": -60}, {"lightness": 23}, {"visibility": "on"}]}];
        $scope.styleMapGreener = [{"stylers": [{"saturation": -100}]}, {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#0099dd"}]}, {"elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"color": "#36bc51"}]}, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "on"}]}, {"featureType": "road.arterial", "elementType": "labels.text", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "labels.text", "stylers": [{"visibility": "on"}]}, {}];
        $scope.styleMapApple = [{"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"}]}, {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"color": "#d0e3b4"}]}, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#bde6ab"}]}, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffe15f"}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"}]}, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "on"}]}, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}]}, {"featureType": "road.arterial", "elementType": "labels", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"}]}, {"featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{"color": "#cfb2db"}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}];
        $scope.styleMapBlack = [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]}, {"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]}, {"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 20}]}, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 20}]}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 21}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 17}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 18}]}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 16}]}, {"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 19}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 17}]}];
        $scope.styleMapAshish = [{"featureType": "all", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"}, {"hue": "#7aff00"}]}, {"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#444444"}]}, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2f2f2"}]}, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100}, {"lightness": 45}]}, {"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"}]}, {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#3a5a67"}, {"visibility": "on"}]}];

        $scope.styleMaps = [
            {name: 'Apple', style: $scope.styleMapApple},
            {name: 'Ashish', style: $scope.styleMapAshish},
            {name: 'Black', style: $scope.styleMapBlack},
            {name: 'Flat', style: $scope.styleMapFlat},
            {name: 'Greener', style: $scope.styleMapGreener}];

        $scope.styleSelected = $scope.styleMaps[0];

        $scope.$watch('styleSelected', function (newvalue, oldvalue) {
            //$log.info(oldvalue.name + " ==> " + newvalue.name);
            if (newvalue.style && $scope.map) {
                $scope.map.options.styles = newvalue.style;
            }
        });

        uiGmapGoogleMapApi.then(function (maps) {
            setMapValues(maps);
        });

        var setMapValues = function (map) {

            $scope.iconimg = {
                url: './img/Map-Marker-Flat-Yellow-Shadow.png', //'https://www.sharedesk.net/images/map/cluster_on.svg', // url
                scaledSize: new google.maps.Size(42, 42), // size
            };
            $scope.iconimghightlight = {
                url: './img/Map-Marker-Flat-Blue-Shadow.png', //'https://www.sharedesk.net/images/map/cluster_on.svg', // url
                scaledSize: new google.maps.Size(42, 42), // size
            };

            $scope.iconimghightlightBig = {
                url: 'img/logoUnlockSpaces.png', //'./img/Map-Marker-Flat-Blue-Shadow.png', //'https://www.sharedesk.net/images/map/cluster_on.svg', // url
                scaledSize: new google.maps.Size(64, 64), // size
            };

            var latIni = ($stateParams.lat) ? parseFloat($stateParams.lat) : -33.407550;
            var lonIni = ($stateParams.lon) ? parseFloat($stateParams.lon) : -70.570209;

            $scope.map = {
                windowTemplate: "tpl/blocks/venue-small-window.html",
                windowParameter: function (marker) {
                    return marker;
                },
                infoWindowWithCustomClass: {
                    options: {
                        //boxClass: 'custom-info-window',
                        //closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
                        disableAutoPan: false
                    },
                    show: true
                },
                center: {latitude: latIni, longitude: lonIni},
                zoom: 12,
                options: {maxZoom: 16, minZoom: 11, styles: $scope.styleSelected.style},
                events: {
                    dragend: function (map) {
                        $scope.$apply(function () {
                            searchVenuesOnMapBound(map);
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
                            searchVenuesOnMapBound(map);
                        });
                    },
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            if (firstTime) {
                                $log.info("firstTime");
                                loadSearchBar(map);
                                searchVenuesOnMapBound(map);
                                $scope.mapInstance = map;
                                if ($stateParams.venuesSearchText) {
                                    var input = (document.getElementById('pac-input'));
                                    input.value = $stateParams.venuesSearchText;
                                }
                            }
                        });
                    }
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
                searchVenuesOnMapBound(map);
            });

            var input = (document.getElementById('opciones'));
            map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(input);

            var bounds = map.getBounds();
            if (searchBox !== null) {
                searchBox.setBounds(bounds);
            }
        };

        var dateFormat = function (date) {
            var stringDate = date.getFullYear() + '-' +
                    (date.getMonth() + 1) + '-' + date.getDate() +
                    '-' + date.getHours() + '-' + date.getMinutes();
            return stringDate;
        };

        var searchVenuesOnMapBound = function (map) {
//            $log.info("loadSpaceMarkers");
            //$scope.markers = [];
            if (map !== null) {
                $scope.lastRadioUsed = calcRadio(map);
                $scope.lastCenterUsed = map.getCenter();
            }
            if ($scope.lastCenterUsed) {
                venuesList = venuesService.geoSearchAvailable($scope.lastCenterUsed.lat(), $scope.lastCenterUsed.lng(), $scope.lastRadioUsed, dateFormat($scope.dt), dateFormat($scope.vm.dateTimeEndTime));
//            venuesList = venuesService.geoSearch(center.lat(), center.lng(), radio);
                venuesList.$promise.then(function () {
                    refreshMapMarkers();
                    if (venuesList.length === 0) {
                        findFormattedAddress($scope.lastCenterUsed);
                    }
//                $log.info("markers length:" + $scope.markers.length);
                    if (firstTime) {
                        firstTime = false;
                    }
                });
            }
        };

        var findFormattedAddress = function (center) {
            var latlng = new google.maps.LatLng(center.lat(), center.lng());
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        $scope.formattedAddress = results[1].formatted_address;
                    }
                }
            });
        }

        var compareSpace = function (a, b) {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            return 0;
        };

        $scope.$watch('spaceSelected', function (a, b) {
            $log.info("spaceSelected has changed from " + b + " to " + a)
        });

        $scope.viewDetailOfSpace = function (space, venue) {
            $scope.detailView = true;
            $scope.spaceSelected = angular.copy(space);
            $scope.venueSelected = venue;
//            $log.info("$scope.spaceSelected.id: " + $scope.spaceSelected.id);
            $scope.centerMapOnVenue(venue);
            $scope.highlightMarker(venue, true);
        };

        $scope.viewResults = function () {
            $scope.detailView = false;
            $scope.normalizeMarker($scope.venueSelected);
        };

        $scope.venuesIsEmpty = function () {
            var retorno = ($scope.venues.length === 0);
            //$log.info("venuesIsEmpty:"+retorno);
            return retorno;
        };

        var createSpaceSlides = function (spaces) {
            for (var index = 0; index < spaces.length; index++) {
                var space = spaces[index];
                space.slides = [];
                if (space.frontPhoto) {
                    space.slides.push({
                        image: space.frontPhoto
                    });
                }
                if (space.photos) {
                    space.photos.forEach(function (photourl) {
                        space.slides.push({
                            image: photourl
                        });
                    });
                }
            }
        };

        var refreshMapMarkers = function () {
            var tempmarkers = [];
            var detailsVenue = null;
            var detailsSpace = null;
            venuesList.sort(compareSpace);
            for (var i = 0; i < venuesList.length; i++) {
                //createSpaceSlides(venuesList[i].spaces);
                tempmarkers.push(createMarker(venuesList[i]));
                if (firstTime && $scope.detailView && (detailsVenue === null)) {
                    if (venuesList[i].id === parseInt($stateParams.venueid)) {
                        venuesList[i].spaces.forEach(function (space) {
                            if (space.id === parseInt($stateParams.spaceid)) {
                                detailsVenue = venuesList[i];
                                detailsSpace = space;
                            }
                        });
                    }
                }
                //$scope.venues.push(venuesList[i]);
            }
            var i = 0;
            while (i < $scope.markers.length) {
                var index = markerIndexOf(tempmarkers, $scope.markers[i]);
                if (index < 0) {
//                    $log.info("elimino el " + i);
                    $scope.markers.splice(i, 1);
                    $scope.venues.splice(i, 1);
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
                    createSpaceSlides(venuesList[i].spaces);
                    $scope.venues.push(venuesList[i]);
                }
                i++;
            }
            if (firstTime && $scope.detailView) {
                $scope.viewDetailOfSpace(detailsSpace, detailsVenue);
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

        var createMarker = function (venue) {

            var markerProps = {
                venue: venue,
                coordinates: {
                    latitude: venue.address.latitude,
                    longitude: venue.address.longitude
                },
                title: venue.overview.title,
                id: venue.id,
                show: false,
                //distance: ((space.distance > 1000) ? (Number((space.distance / 1000).toFixed(1)) + " Kms") : (Number((space.distance).toFixed(1)) + " Mts")),
                icon: $scope.iconimg,
                opciones: {
                    labelAnchor: (('' + venue.id).length * 4) + " 32",
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

        $scope.centerMapOnVenue = function (venue) {
            if ($scope.optionsModel.centerOnMap) {
                $scope.mapInstance.panTo({lat: parseFloat(venue.address.latitude), lng: parseFloat(venue.address.longitude)});
            }
        };

        $scope.centerMapOnLatLon = function (lat, lon) {
            $scope.mapInstance.panTo({lat: parseFloat(lat), lng: parseFloat(lon)});
        };

        $scope.highlightMarker = function (space, big) {
            var index = markerIndexOf($scope.markers, space);
            var marker = $scope.markers[index];
            if (big) {
                marker.icon = $scope.iconimghightlightBig;
            } else {
                marker.icon = $scope.iconimghightlight;
            }
        };

        $scope.normalizeMarker = function (space) {
            if (!$scope.detailView) {
                //$log.info("normalizeMarker(" + space.id + ")");
                var index = markerIndexOf($scope.markers, space);
                var marker = $scope.markers[index];
                marker.icon = $scope.iconimg;
            }
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

        $scope.openCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
    });
    //Controller para manejar el template de la ventanita que se muestra en un marker del mapa.
    mapControllers.controller("winTemplateCtrl", ["$scope", function ($scope) {
            $scope.viewDetailOfSpace = function (space, venue) {
                var scope = angular.element(document.getElementById("divMapContainter")).scope();
                scope.viewDetailOfSpace(space, venue);
//                scope.$apply(function () {
//                    
//                });
            };

        }]);

    mapControllers.directive('ngAutocomplete', function (uiGmapGoogleMapApi) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                options: '=',
                details: '='
            },
            link: function (scope, element, attrs, controller) {
                //options for autocomplete
                var opts
                var watchEnter = false
                var libraryReady = false
                var mustInitOps = false;
                //convert options provided to opts
                var initOpts = function () {
                    if (libraryReady) {
                        mustInitOps = false;
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
                    } else {
                        mustInitOps = true;
                    }
                }

                var executeAfterLoadLibrary = function () {
                    if (scope.gPlace === undefined) {
                        scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
                    }
                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        var result = scope.gPlace.getPlace();
                        if (result !== undefined) {
                            if (result.address_components !== undefined) {

                                scope.$apply(function () {
                                    console.info("result:" + result);
//                                    if(!scope.details){
//                                        scope.details = {};
//                                    }
                                    scope.details.result = result;

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

                uiGmapGoogleMapApi.then(function (maps) {
                    if (!libraryReady) {
                        libraryReady = true;
                        executeAfterLoadLibrary();
                        if (mustInitOps) {
                            initOpts();
                        }
                    }
                });

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