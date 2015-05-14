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
    'mapControllers',
    , 'http-auth-interceptor'
])
        .factory('Venues', function (unlockRestResource) {
            return unlockRestResource('venues');
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
                        } else {
                            $location.path('/access/signin');
                        }
                    }
                }

            });
        })
        ;

