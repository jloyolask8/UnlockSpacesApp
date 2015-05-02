'use strict';

var AUTH0_CLIENT_ID = '8e3elusXRGQ8Jp2vv0i3T8B3KcW4zWeG';
var AUTH0_DOMAIN = 'unlockspaces.auth0.com';
var AUTH0_CALLBACK_URL = location.href;

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
    'ngAutocomplete',
    'cloudinary',
    'angularFileUpload',
    'photoAlbumAnimations',
//    'photoAlbumControllers',
    'photoAlbumServices',
    'spacesRestClient',
    'uiGmapgoogle-maps',
    'mapControllers'
//   ,'http-auth-interceptor'
])
        .factory('Venues', function (unlockRestResource) {
            return unlockRestResource('venues');
        })


        .config(function AppConfig($routeProvider, authProvider, $httpProvider, $locationProvider,
                jwtInterceptorProvider) {

            authProvider.init({
                domain: AUTH0_DOMAIN,
                clientID: AUTH0_CLIENT_ID,
                loginState: 'access.signin'
            });

            jwtInterceptorProvider.tokenGetter = function (store) {
                return store.get('token');//TODO: note i use auth_token
            };

            // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
            // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
            // want to check the delegation-token example
            $httpProvider.interceptors.push('jwtInterceptor');
        })

        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization,places'
            });
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

$.cloudinary.config().cloud_name = 'virtuosisimo';
$.cloudinary.config().upload_preset = 'xq7agj5x';
//$.cloudinary.config().cloud_name = 'unlockspaces';
//$.cloudinary.config().upload_preset = 'unlock';