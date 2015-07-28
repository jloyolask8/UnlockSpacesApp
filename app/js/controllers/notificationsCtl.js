//(function() {
'use strict';

/* venue view Controller */

app.controller('NotificationsCtl', function ($scope, $http, $state, $log, $stateParams, NotificationService, store, Users) {
    $scope.message = 'hello from NotificationsCtl';
    $log.log($scope.message);
    $scope.notifications = [];
    $scope.user = {};
    $scope.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    $scope.selectNotification = function (notification, gotonotifications) {
        angular.forEach($scope.notifications, function (notification) {
            notification.selected = false;
        });

        $scope.notification = notification;
        $scope.notification.selected = true;
        if(gotonotifications){
            $state.go('app.notifications');
        }
    };

    $scope.fetchAll = function () {

        console.log('loading notifications ... ');

        NotificationService.query().then(function (notifications) {
            $scope.notifications = notifications;
            $scope.note = $scope.notifications[0];
            $scope.notifications[0].selected = true;
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

    Users.getById(store.get('profile').user_id).then(
            function (v) {
                $scope.user = v;
            },
            function (err) {
                alert('error getting user data:' + err);
            }
    );



});
//})();
