angular.module('app')
        .directive('uiButterbar', ['$rootScope', '$anchorScroll', function ($rootScope, $anchorScroll) {
                return {
                    restrict: 'AC',
                    template: '<span class="bar"></span>',
                    link: function (scope, el, attrs) {
                        el.addClass('butterbar hide');
                        scope.$on('$stateChangeStart', function (event) {
                            $anchorScroll();
                            el.removeClass('hide').addClass('active');
                            console.log('$stateChangeStart loader_show: el.removeClass(hide).addClass(active) ');
                        });
                        scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                            event.targetScope.$watch('$viewContentLoaded', function () {
                                el.addClass('hide').removeClass('active');
                                console.log('$stateChangeSuccess loader_hide el.addClass(hide).removeClass(active) ');
                            });
                        });
                        //unlock spaces http interceptor events
                        scope.$on("loader_show", function () {
                            //console.log('loader_show');
                            $anchorScroll();
                            el.removeClass('hide').addClass('active');
                        });
                        return scope.$on("loader_hide", function (event) {
                            //console.log('loader_hide');
                            event.targetScope.$watch('$viewContentLoaded', function () {
                                el.addClass('hide').removeClass('active');
                            });
                        });
                    }
                };
            }]);