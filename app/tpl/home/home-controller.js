(function () {
    'use strict';

    /* venue view Controller */

    app.controller('HomeController', ['$scope', '$http', '$state', '$log', '$location', function ($scope, $http, $state, $log, $location) {
            $scope.venuesSearchInputText = '';

            $scope.addressDetails = {};

            $scope.$watch('addressDetails.result', function (newv, old) {
                if ($scope.addressDetails.result) {
                    $log.info(newv.geometry);
                    $('#searchButton').click();
                }
            });
        }]);
})();


