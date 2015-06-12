/* 
 * Copyright (C) 2015 jorge
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

'use strict';


app.controller('DashboardController', ['$scope', '$http', '$state', '$log', 'reservationsService',
    function ($scope, $http, $state, $log, reservationsService) {

        $scope.message = 'hello from DashboardController';
        $scope.reservations = {list: null};

        $scope.getUserReservations = function () {

            console.log('loading user reservations... ');

            var reservations = reservationsService.findReservationsByUserId();
            reservations.$promise.then(function () {
                //alert("reservations: "+reservations.length);
                $scope.reservations.list = reservations;
            });

        };
        
        $scope.getUserReservations();
    }]);