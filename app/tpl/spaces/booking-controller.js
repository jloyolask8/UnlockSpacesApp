'use strict';

/* Controllers */
// signin controller

app.controller('BookingController', function (auth, $scope, $state, $location, $stateParams, SpacesRS) {

    $scope.initDate = new Date();
    $scope.format = 'yyyy/MM/dd HH:mm';

    $scope.selectedSpace = {};
    //space/venue type

    $scope.newReservationObj = {};

    loadParams();

    function loadParams() {
        if ($stateParams.dateSelected) {
            $scope.newReservationObj.startDateTime = $stateParams.dateSelected;
        } else {
            $scope.today();
        }

        if ($stateParams.spaceId) {
            SpacesRS.getById($stateParams.spaceId).then(
                    function (v) {
                        $scope.newReservationObj.space = v;
                    },
                    function (err) {
                        alert('error:' + err);
                    }
            );
        }
    }

    $scope.today = function () {
        $scope.newReservationObj.startDateTime = new Date();
    };


    $scope.clear = function () {
        $scope.newReservationObj.startDateTime = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        class: 'datepicker'
    };





    console.log('hello from BookingController');



    $scope.submit = function () {
//        window.location.href = e.href("app.page.search", {venuesSearchText: $scope.venuesSearchInputText}, {reload: !0})
    };

});


