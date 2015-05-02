'use strict';

/* Controllers */

angular.module('app')

        .controller('AppCtrl', function MainController($scope, $state, $translate, $localStorage, $window, $location, auth, store) {

            $scope.auth = auth;

            $scope.$watch('auth.profile', function (profile) {
                if (!profile) {
                    return;
                } else if (profile.locale === 'en' || profile.locale === 'es') {
                    $scope.setLang(profile.locale);
                }

            });



//        .controller('AppCtrl', ['$scope', '$state', '$translate', '$localStorage', '$window',
//            function ($scope, $state, $translate, $localStorage, $window, auth, store) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

//                useful in case user leaves the critical view page accidentally?
//                $scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
            //react on the location change here
            //for example, update breadcrumbs based on the newUrl
//                });

            $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
                if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
                    $scope.pageTitle = nextRoute.$$route.pageTitle + ' | TODO change Auth0 routeChangeSuccess';
                }
            });

//            $scope.$on('event:auth-loginRequired', function () {
//                $state.go('access.signin');
//            });
//            $scope.$on('event:auth-loginConfirmed', function () {
//            });

            // config
            $scope.app = {
                name: 'Unlock Spaces',
                version: '0.1',
                debug: false,
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: true,
                    asideDock: false,
                    container: false
                }
            };

            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.lang = {isopen: false};
            $scope.langs = {en: 'English', es: 'Español'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            function isSmartDevice($window)
            {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }



            $scope.logout = function () {
                auth.signout();
                store.remove('profile');
                store.remove('token');
                $location.path('/');
            };

        });
//            }]);


