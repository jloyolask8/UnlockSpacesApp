'use strict';

/* Controllers */
// put here the venues controller


app.controller('VenuesListController', ['$scope', '$http', '$state', '$log', 'Venues', function ($scope, $http, $state, $log, Venues) {
        $scope.messageVenue = 'hello from venues VenuesListController';
        $log.log($scope.messageVenue);
        $scope.data = [];

        $scope.fetchAll = function () {

            Venues.query().then(function (venues) {
                $scope.data = venues;
                $state.go("app.venues.list");
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Connection Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        };

        $scope.remove = function (venue, $index, $event) {
            // Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
            // an edit of this item.
            $event.stopPropagation();

            $log.log(venue);

            // Remove this user
            Venues.remove(venue, function () {
                // It is gone from the DB so we can remove it from the local list too
                $scope.data.splice($index, 1);
                $state.go("app.venues.list");
//                i18nNotifications.pushForCurrentRoute('crud.user.remove.success', 'success', {id: user.$id()});
            }, function () {
                alert("Sorry we are not able to complete the operation.");
//                i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'error', {id: user.$id()});
            });
        };

//        $scope.remove = function (Venue) {
//
//            Venue.$remove(function (data) {
//                alert("removed ok:" + data);
//            }, function (data) {
//                alert("error:" + data);
//            });
////            $state.go("app.venues.list");
//
//        };

        $scope.fetchAll();

    }]);

app.controller('VenueEditController', ['REST_CONFIG', '$log', '$scope', '$rootScope', '$http', '$state', 'Venues', '$stateParams', 'Upload',
    function (REST_CONFIG, $log, $scope, $rootScope, $http, $state, Venues, $stateParams, Upload) {

        var that = this;
        $scope.space = {};
        $scope.uploadingImages = false;
        $scope.editSpaceMode = false;
        $scope.selectedVenue = {};
        $scope.addressDetails = '';

        $scope.autocompleteCityOptions = {
            types: '(cities)'
        };

        $scope.autocompleteAddressOptions = {
//            city: '(Santiago, Chile)'
        };

        Venues.getById($stateParams.venueId).then(
                function (v) {
                    $scope.selectedVenue = v;
                },
                function (err) {
                    alert('error:' + err);
                }
        );

        //
        //        $scope.$watch('addressDetails.geometry.location.A', function (old, newv) {
        //              console.log('addressDetails a watched ' + old + " " + newv);
        //        });

        $scope.selectedFile = {
            progress: 0
        };

        $scope.selectedSpaceFile = {
            progress: 0
        };

        $scope.uploadImages = function (files, isvenue) {
            var imagesToUpload = files;
            for (var i = 0; i < imagesToUpload.length; i++) {
                var file = imagesToUpload[i];
                $log.info('uploading file ' + file.name);
                var serviceUrl = "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload";
                $log.info("serviceUrl: " + serviceUrl);
                $scope.upload = Upload.upload({
                    url: serviceUrl,
                    fields: {upload_preset: $.cloudinary.config().upload_preset, tags: 'myphotoalbum', context: 'photo=' + $scope.title},
                    file: file
                }).progress(function (e) {
                    $scope.selectedFile.progress = Math.round((e.loaded * 100.0) / e.total);
                    $scope.selectedFile.status = "Uploading... " + $scope.selectedFile.progress + "%";
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }).success(function (data, status, headers, config) {
//                    $rootScope.photos = $rootScope.photos || [];
                    data.context = {custom: {photo: $scope.title}};
                    $scope.selectedFile.result = data;
                    if (isvenue) {
                        $scope.selectedVenue.frontPhoto = {cloudinaryUrl1: data.public_id};
                    } else {
                        $scope.space.frontPhoto = {cloudinaryUrl1: data.public_id};
                    }
                    $scope.selectedFile.status = "Imagen lista!";
//                    $rootScope.photos.push(data);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.selectedFile.progress = 0;
                }).error(function () {
                    $scope.selectedFile.status = "Ups, no hemos podido subir la imagen, prueba otra vez!";
                    $scope.selectedFile.progress = 0;
                });
            }
        };

        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function ($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };

        $scope.addNewSpace = function () {

            $scope.space = {
                overview: {
                    summary: '',
                    title: ''
                }
            };

            $scope.space.isNew = true;

            $scope.editSpace($scope.space);

        };

        $scope.editSpace = function (space, $index) {
//            space.editedSpace = true;
            $scope.editSpaceMode = true;
            // Clone the original todo to restore it on demand.
            $scope.originalSpace = angular.extend({}, space);
            $scope.space = space;
            $scope.spaceIndex = $index;
        };

        $scope.doneEditing = function () {
            $scope.editSpaceMode = false;
            if ($scope.space.isNew) {
                $scope.space.isNew = false;
                $scope.selectedVenue.spaces.push($scope.space);
            } else {

                $scope.selectedVenue.spaces[$scope.spaceIndex] = $scope.space;
            }

//            $http.put(REST_CONFIG.baseUrl + 'spaces' + '/' + $scope.space.id, $scope.space)
//                    .success(function (data, status, headers) {
//
//                        $scope.headers = headers;
//                        $scope.data = data;
//                        $scope.status = status;
//                    })
//                    .error(function (data, status) {
//                        $scope.data = data || "Request failed";
//                        $scope.status = status;
//                        if (status === 0) {
//                            alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
//                            return;
//                        }
//
//                    });
            $scope.space = {};
            $scope.originalSpace = {};

        };

        $scope.revertEditing = function () {
            $scope.editSpaceMode = false;
            $scope.spaceIndex = -1;
//            venue.spaces[venue.spaces.indexOf(space)] = $scope.originalSpace;
//            $scope.doneEditing($scope.originalSpace);
        };

        $scope.edit = function () {

            $http.put(REST_CONFIG.baseUrl + 'venues' + '/' + $scope.selectedVenue.id, $scope.selectedVenue)
                    .success(function (data, status, headers) {

                        $scope.headers = headers;
                        $scope.data = data;
                        $scope.status = status;

                        $state.go("app.venues.list");

                    })
                    .error(function (data, status) {
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                        if (status === 0) {
                            alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                            return;
                        }

                    });

        };


        $scope.log = function () {
            console.log($scope.autocompleteCityDetails);
        };

        $scope.cancel = function () {
            $state.go("app.venues.list");
        };

    }]);

app.controller('VenuesCreateController', ['REST_CONFIG', '$scope', '$http', '$state', '$log', 'Venues', function (REST_CONFIG, $scope, $http, $state, $log, Venues) {

        $scope.messageVenue = 'hello from venues VenuesCrateController';
        $log.log($scope.messageVenue);

        $scope.venueTypeModel = '1';

        //TODO change for a function to pull types from api
        $scope.getVenueTypes = function () {
            return ["1", "2"];
        }

        $scope.newVenueObj = {
            overview: {
                summary: '',
                title: ''
            },
            venueType: $scope.venueTypeModel
        };

        $scope.cancelCreate = function () {
            $state.go("app.venues.list");
        };

        $scope.createVenue = function () {

            $http.post(REST_CONFIG.baseUrl + 'venues', $scope.newVenueObj)
                    .success(function (data, status, headers) {

                        $scope.headers = headers;
                        $scope.data = data;
                        $scope.status = status;

                        $state.go("app.venues.list");

//                        var newTaskUri = headers()["location"];

//                        console.log("Might be good to GET " + newTaskUri + " and append the task.");

                        // Refetching EVERYTHING every time can get expensive over time
                        // Better solution would be to $http.get(headers()["location"]) and add it to the list

                    })
                    .error(function (data, status) {
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                        if (status === 0) {
                            alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                            return;
                        }

                    });

        };

    }]);