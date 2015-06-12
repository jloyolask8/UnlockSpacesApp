var AUTH0_CLIENT_ID = '8e3elusXRGQ8Jp2vv0i3T8B3KcW4zWeG';
var AUTH0_DOMAIN = 'unlockspaces.auth0.com';
var AUTH0_CALLBACK_URL = location.href;

$.cloudinary.config().cloud_name = 'virtuosisimo';
$.cloudinary.config().upload_preset = 'xq7agj5x';
//$.cloudinary.config().cloud_name = 'unlockspaces';
//$.cloudinary.config().upload_preset = 'unlock';

// config

var app =
        angular.module('app')



        .config(function AppConfig($routeProvider, authProvider, $httpProvider, $locationProvider,
                jwtInterceptorProvider) {

            authProvider.init({
                domain: AUTH0_DOMAIN,
                clientID: AUTH0_CLIENT_ID, 
                loginState: 'access.signin'
            });

            authProvider.on('loginSuccess', function ($state, $timeout) {
                $timeout(function () {
//                    $state.go('home');
                      console.log('::loginSuccess::');
                });
            });

            authProvider.on('authenticated', function (auth, $state) {
                console.log(auth + " " + $state);
                console.log('Authenticated - page refresh and user still authenticated');
            });

            authProvider.on('loginFailure', function () {
                console.log("Error authenticating the user");
            });

            authProvider.on('logout', function () {
                console.log("User successfully logged out");
            });

            authProvider.on('forbidden', function () {
                console.log("Forbidden 401");
            });

            jwtInterceptorProvider.tokenGetter = ['config', 'store', function (config, store) {
                    // Skip authentication for any requests to api.cloudinary.com
                    if (config.url.indexOf('api.cloudinary.com') !== -1) {
                        return null;
                    }

                    return store.get('token');
//                    return localStorage.getItem('token');
                }];

            // Add a simple interceptor that will fetch all requests and add the jwt token to its 
            // authorization header.
            // NOTE: in case you are calling APIs which expect a token signed with a different secret, 
            // you might want to check the delegation-token example
            $httpProvider.interceptors.push('jwtInterceptor');
        })

        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization,places'
            });
        })
        .config(
                ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                        // lazy controller, directive and service
                        app.controller = $controllerProvider.register;
                        app.directive = $compileProvider.directive;
                        app.filter = $filterProvider.register;
                        app.factory = $provide.factory;
                        app.service = $provide.service;
                        app.constant = $provide.constant;
                        app.value = $provide.value;
                    }
                ])
        .config(['$translateProvider', function ($translateProvider) {
                // Register a loader for the static files
                // So, the module will search missing translation tables under the specified urls.
                // Those urls are [prefix][langKey][suffix].
                $translateProvider.useStaticFilesLoader({
                    prefix: 'l10n/',
                    suffix: '.js'
                });
                // Tell the module what language to use by default
                $translateProvider.preferredLanguage('es');
                // Tell the module to store the language in the local storage
                $translateProvider.useLocalStorage();
            }]);
