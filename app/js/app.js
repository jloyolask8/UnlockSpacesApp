'use strict';



angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'auth0',
    'angular-storage',
    'angular-jwt',
    //'ngAutocomplete',
    'cloudinary',
    'ngFileUpload',
    'photoAlbumAnimations',
//    'photoAlbumControllers',
    'photoAlbumServices',
    'spacesRestClient',
    'uiGmapgoogle-maps',
    'wu.staticGmap',
    'mapControllers',
    //'HomeController',
    , 'http-auth-interceptor'
])
        .factory('Venues', function (unlockRestResource) {
            return unlockRestResource('venues');
        })
        
         .factory('SpacesRS', function (unlockRestResource) {
            return unlockRestResource('spaces');
        })
        
        .factory('ReservationsRS', function (unlockRestResource) {
            return unlockRestResource('reservations');
        })

        .factory('SpaceTypes', function (unlockRestResource) {
            return unlockRestResource('spacetypes');
        })

        .factory('VenueTypes', function (unlockRestResource) {
            return unlockRestResource('venuetypes');
        })

        .factory('Currencies', function (unlockRestResource) {
            return unlockRestResource('currencies');
        })

        .factory('Amenities', function (unlockRestResource) {
            return unlockRestResource('amenity');
        })

        .run(function ($rootScope, auth, store, jwtHelper, $location) {
            $rootScope.$on('$locationChangeStart', function () {
                if (!auth.isAuthenticated) {
                    var token = store.get('token');
                    if (token) {
                        if (!jwtHelper.isTokenExpired(token)) {
                            auth.authenticate(store.get('profile'), token);
                        }
//                        else {
//                            $location.path('/home');
//                        }
                    }
                }

            });
        })

        .factory('httpInterceptor', function ($q, $rootScope) {

            var numLoadings = 0;

            return {
                request: function (config) {

                    numLoadings++;

                    // Show loader
                    $rootScope.$broadcast("loader_show");
                    return config || $q.when(config)

                },
                response: function (response) {

                    if ((--numLoadings) === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }

                    return response || $q.when(response);

                },
                responseError: function (response) {

                    if (!(--numLoadings)) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }

                    return $q.reject(response);
                }
            };
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        })
;

