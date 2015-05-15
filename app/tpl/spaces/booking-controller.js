'use strict';

/* Controllers */
// signin controller

app.controller('BookingController', function (auth, $scope, $state, $location, $stateParams, SpacesRS) {
    $scope.test = '';
    $scope.selectedSpace = {};
    //space/venue type
    
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();
    
    $scope.clear = function () {
      $scope.dt = null;
    };
    
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      class: 'datepicker'
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd HH:mm', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    
     $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.optionsTime = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleModeTime = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.updateTime = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changedTime = function () {
      //console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clearTime = function() {
      $scope.mytime = null;
    };

    console.log('hello from BookingController');

    SpacesRS.getById($stateParams.spaceId).then(
            function (v) {
                $scope.selectedSpace = v;
            },
            function (err) {
                alert('error:' + err);
            }
    );

    $scope.submit = function () {
//        window.location.href = e.href("app.page.search", {venuesSearchText: $scope.venuesSearchInputText}, {reload: !0})
    };

});


