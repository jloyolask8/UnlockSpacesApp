

// config

var app =
        angular.module('app')

        .constant('REST_CONFIG', {
            baseUrl: 'http://localhost:8080/UnlockServices/api/',
            apiKey: 'f80ebc87-ad5c-4b29-9366-5359768df5a1'
        })
        .constant('IMAGES_CLOUD_CONFIG', {
            cloudinaryBaseUrl: '',
            apiKey: ''
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