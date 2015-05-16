/* 
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
 * 
 * Custom REST adapters with $http
 The $resource factory is very handy, but if you hit its limitations it is relatively easy
 to create a custom, $resource-like factory based on the $http service. By taking
 time to write a custom resource factory we can gain full control over URLs and data
 pre/post processing. As a bonus we would no longer need to include the angular-
 resource.js file and thus save few KB of the total page weight.
 What follows is a simplified example of a custom resource-like factory dedicated
 to the MongoLab RESTful API. Familiarity with the Promise API is the key to
 understanding this implementation:
 */
angular.module('app')
        .factory('unlockRestResource', ['servicesUrls', '$http', '$q', '$log', function (servicesUrls, $http, $q, $log) {

        function UnlockRestResourceFactory(collectionName) {

            var url = servicesUrls.baseUrl + collectionName;
            var defaultParams = {};
//            if (servicesUrls.apiKey) {
//                defaultParams.apiKey = servicesUrls.apiKey;
//            }

            var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
                var scb = successcb || angular.noop;
                var ecb = errorcb || angular.noop;

                return httpPromise.then(function (response) {
                    var result;
                    if (isArray) {
                        result = [];
                        for (var i = 0; i < response.data.length; i++) {
                            result.push(new Resource(response.data[i]));
                        }
                    } else {
                        //if not found expect 404 HTTP response status...
                        if (response.status === " null " || response.status === 404) {
                            return $q.reject({
                                code: 'resource.notfound',
                                collection: collectionName
                            });
                        } else {
                            result = new Resource(response.data);
                        }
                    }
                    scb(result, response.status, response.headers, response.config);
                    return result;
                }, function (response) {
                    ecb(response, response.status, response.headers, response.config);
                    return response;
                });
            };

            var Resource = function (data) {
                angular.extend(this, data);
            };

            Resource.all = function (cb, errorcb) {
                return Resource.query({}, cb, errorcb);
            };

            Resource.query = function (queryJson, successcb, errorcb) {
                var params = angular.isObject(queryJson) ? {q: JSON.stringify(queryJson)} : {};
                var httpPromise = $http.get(url, {params: angular.extend({}, defaultParams, params)});
                return thenFactoryMethod(httpPromise, successcb, errorcb, true);
            };

            Resource.getById = function (id, successcb, errorcb) {
                var httpPromise = $http.get(url + '/' + id, {params: defaultParams});
                return thenFactoryMethod(httpPromise, successcb, errorcb);
            };
            
            Resource.remove = function (id, successcb, errorcb) {
                var httpPromise = $http['delete'](url + "/" + id, {params: defaultParams});
                return thenFactoryMethod(httpPromise, successcb, errorcb);
            };

            Resource.getByIds = function (ids, successcb, errorcb) {
                var qin = [];
                angular.forEach(ids, function (id) {
                    qin.push({$oid: id});
                });
                return Resource.query({_id: {$in: qin}}, successcb, errorcb);
            };

            //instance methods

            Resource.prototype.$id = function () {
                if (this._id && this._id.$oid) {
                    return this._id.$oid;
                }
            };

            Resource.prototype.$save = function (successcb, errorcb) {
                var httpPromise = $http.post(url, this, {params: defaultParams});
                return thenFactoryMethod(httpPromise, successcb, errorcb);
            };

            Resource.prototype.$update = function (successcb, errorcb) {
                var httpPromise = $http.put(url + "/" + this.$id(), angular.extend({}, this, {_id: undefined}), {params: defaultParams});
                return thenFactoryMethod(httpPromise, successcb, errorcb);
            };

            Resource.prototype.$remove = function (successcb, errorcb) {
                var httpPromise = $http['delete'](url + "/" + this.$id(), {params: defaultParams});
                return thenFactoryMethod(httpPromise, successcb, errorcb);
            };

            Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
                if (this.$id()) {
                    return this.$update(updatecb, errorUpdatecb);
                } else {
                    return this.$save(savecb, errorSavecb);
                }
            };

            return Resource;
        }
        return UnlockRestResourceFactory;
    }]);