'use strict';
angular
        .module('datetimepicker', [])
.directive('datetimepicker', function($timeout, $parse) {
        return {
            link: function($scope, element, $attrs) {
                return $timeout(function() {
                    var ngModelGetter = $parse($attrs['ngModel']);

                    return $(element).datetimepicker(
                        {
                            minDate:moment().add(1, 'd').toDate(),
                            sideBySide:true,
                            allowInputToggle:true,
                            //locale:"tr",
                            useCurrent:false,
                            defaultDate:moment().add(1, 'd').add(1,'h'),
                            icons:{
                                time: 'icon-back-in-time',
                                date: 'icon-calendar-outlilne',
                                up: 'icon-up-open-big',
                                down: 'icon-down-open-big',
                                previous: 'icon-left-open-big',
                                next: 'icon-right-open-big',
                                today: 'icon-bullseye',
                                clear: 'icon-cancel'
                            }
                        }
                    ).on('dp.change', function(event) {
                            $scope.$apply(function() {
                                return ngModelGetter.assign($scope, event.target.value);
                            });
                    });
                });
            }
        };
    });