//(function() {
'use strict';

/* venue view Controller */

app.controller('YourListingsController', ['$scope', '$http', '$state', '$log', '$stateParams', 'venuesService',
    function ($scope, $http, $state, $log, $stateParams, venuesService) {
        $scope.messageVenue = 'hello from YourListingsController';
        $log.log($scope.messageVenue);
        
        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1', active: false},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', active: true}
        ];
        
    }]);
//})();
