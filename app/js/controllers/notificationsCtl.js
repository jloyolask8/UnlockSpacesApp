//(function() {
'use strict';

/* venue view Controller */

app.controller('NotificationsCtl', function ($scope, $http, $state, $log, $stateParams, NotificationService) {
        $scope.message = 'hello from NotificationsCtl';
        $log.log($scope.message);
        $scope.notifications = [];
       
       $scope.fetchAll = function () {

          console.log('loading notifications ... ');

            NotificationService.query().then(function (notifications) {
                $scope.notifications = notifications;
                console.log('done loading notifications');
                console.log($scope.notifications);
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Connection Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        };
        
        $scope.fetchAll();
        
   });
//})();
