/* 
 *   HTTP INTERCEPTORS
 * 
 * Copyright (C) 2015 jonathan
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

angular.module('httpInterceptors', [])
        .config(function ($httpProvider) {
            $httpProvider.responseInterceptors.push('retryInterceptor');
        })
        .factory('retryInterceptor', function ($injector, $q) {
            return function (responsePromise) {
                return responsePromise.then(null, function (errResponse) {
                    alert(errResponse.status);
                    if (errResponse.status === 503) {
                        alert('503');
                        //503. The server is currently unavailable (because it is overloaded or down for maintenance).
                        //Generally, this is a temporary state.
//                        return $injector.get('$http')(errResponse.config);
                        return $q.reject(errResponse);
                    } else if (errResponse.status === 401) {
                        return $q.reject(errResponse);
                    } else {
                        return $q.reject(errResponse);
                    }
                });
            };
        });


