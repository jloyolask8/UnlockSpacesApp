'use strict';



angular.module('app', [
    //'pickadate',
    'datetimepicker',
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
    'mapControllers'
            //'HomeController',
//    , 'http-auth-interceptor'
])

.factory('CancelationPTypes', function (unlockRestResource) {
            return unlockRestResource('cp');
        })
        .factory('Venues', function (unlockRestResource) {
            return unlockRestResource('venues');
        })

        .factory('Users', function (unlockRestResource) {
            return unlockRestResource('users');
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
        
        .factory('MailTemplate', function (unlockRestResource) {
            return unlockRestResource('mailtemplate');
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
                    //console.log('httpInterceptor request:' + config.url);
                    numLoadings++;
                    // Show loader
                    $rootScope.$broadcast("loader_show");
                    return config || $q.when(config);

                },
                response: function (response) {
                    //console.log('httpInterceptor response from:' + response.url);
                    if ((--numLoadings) === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }else{
                        //console.log('loader_hide didnt go cause numLoadings:'+numLoadings);
                    }

                    return response || $q.when(response);

                },
                responseError: function (response) {
                    //console.log('httpInterceptor responseError:' + response);
                    if (!response.config.ignoreAuthModule) {
                        switch (response.status) {
                            case 0:
                                $rootScope.$broadcast('event:server-error', response);
                            case 401:
//                                delete $window.sessionStorage.auth_token;
                                var deferred = $q.defer();
//                                httpBuffer.append(rejection.config, deferred);
                                $rootScope.$broadcast('event:auth-loginRequired', response);
                                return deferred.promise;
                            case 403:
                                $rootScope.$broadcast('event:auth-forbidden', response);
                                break;
                            case 500:
                                $rootScope.$broadcast('event:server-error', response);
                                break;
                        }
                    }
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

        .run(['auth', function (auth) {
                auth.hookEvents();
            }])
//                .config([
//                'datetimepickerProvider',
//                function (datetimepickerProvider) {
//                    datetimepickerProvider.setOptions({
//                        locale: 'es'
//                    });
//                }
//            ])
        ;

