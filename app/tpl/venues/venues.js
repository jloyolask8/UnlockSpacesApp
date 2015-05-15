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

        $scope.fetchAll();

    }]);

app.controller('VenueViewController', ['$scope', '$http', '$state', '$log', '$stateParams', 'Venues', function ($scope, $http, $state, $log, $stateParams, Venues) {
        $scope.messageVenue = 'hello from venues VenuesViewController';
        $log.log($scope.messageVenue);
        $scope.selectedVenue = {};


        Venues.getById($stateParams.venueId).then(
                function (v) {
                    $scope.selectedVenue = v;
                },
                function (err) {
                    alert('error:' + err);
                }
        );

    }]);

app.controller('VenueEditController', ['servicesUrls', '$log', '$scope', '$rootScope', '$http', '$state', 'Venues', '$stateParams', 'Upload', 'SpaceTypes', 'VenueTypes', 'Currencies', 'Amenities',
    function (servicesUrls, $log, $scope, $rootScope, $http, $state, Venues, $stateParams, Upload, SpaceTypes, VenueTypes, Currencies, Amenities) {
        var vm = this;
        //amenities
        //
        // load from db
        $scope.amenitiesList = [];
        $scope.spaceTypeList = [];
        $scope.venueTypeList = ['Bussiness Center', 'Corporate Office', 'Coworking spaces', 'Startup offices'];
//        getVenueTypes();
        getAmenities();
        getSpaceTypes();



        // watch amenity for changes
        $scope.$watch('amenitiesList|filter:{selected:true}', function (nv) {
            if (nv) {
                $scope.selectedVenue.amenitiesAvailable = nv.map(function (amenity) {
                    return amenity;
                });
            }
        }, true);

        //      selectedVenueAdmin
        $scope.selectedVenueAdmin = {};//new and selected selectedVenueAdmin for edit
        $scope.addNewAdmin = addNewAdmin;
        $scope.editAdmin = editAdmin;
        $scope.doneEditingAdmin = doneEditingAdmin;
        $scope.revertEditingAdmin = revertEditingAdmin;
        $scope.adminRoles = ['Role 1', 'Role 2'];
//      --selectedVenueAdmin 

        $scope.space = {};

        $scope.uploadingImages = false;
        $scope.editSpaceMode = false;
        $scope.selectedVenue = {};
        $scope.addressDetails = {};



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

        $scope.$watch('addressDetails.result', function (newv, old) {
            if ($scope.addressDetails.result) {
                $scope.selectedVenue.address.latitude = $scope.addressDetails.result.geometry.location.lat();
                $scope.selectedVenue.address.longitude = $scope.addressDetails.result.geometry.location.lng();
            }
        });

        $scope.selectedFile = {
            progress: -1
        };

        $scope.selectedSpaceFile = {
            progress: -1
        };

        $scope.uploadImages = function (files, isvenue, isfront) {
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
                        if (isfront) {
                            $scope.selectedVenue.frontPhoto = data.public_id;
                        } else
                        {
                            $scope.selectedVenue.photos.push(data.public_id);
                        }
                    } else {
                        if (isfront) {
                            $scope.space.frontPhoto = data.public_id;
                        } else {
                            if ($scope.space.photos instanceof Array) {
                                $scope.space.photos.push(data.public_id);
                            } else {
                                $scope.space.photos = [data.public_id];
                            }
                        }
                    }
                    $scope.selectedFile.status = "Imagen lista!";
//                    $rootScope.photos.push(data);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.selectedFile.progress = -1;
                }).error(function () {
                    $scope.selectedFile.status = "Ups, no hemos podido subir la imagen, prueba otra vez!";
                    $scope.selectedFile.progress = -1;
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

//            $http.put(servicesUrls.baseUrl + 'spaces' + '/' + $scope.space.id, $scope.space)
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

            $http.put(servicesUrls.baseUrl + 'venues' + '/' + $scope.selectedVenue.id, $scope.selectedVenue)
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

        //selectedVenueAdmin crud logic, please refactor some day

        function editAdmin(venueAdmin, $index) {
            $scope.editAdminMode = true;
            // Clone the original obj to restore it on demand.
            $scope.originalAdmin = angular.extend({}, venueAdmin);
            $scope.selectedVenueAdmin = venueAdmin;
            $scope.selectedVenueAdminIndex = $index;
        }
        ;

        function addNewAdmin() {

            var newVenueAdmin = {
                adminName: '',
                adminRole: '',
                adminEmail: ''
            };

            newVenueAdmin.isNew = true;

            $scope.editAdmin(newVenueAdmin);

        }
        ;

        function doneEditingAdmin() {
            $scope.editAdminMode = false;
            if ($scope.selectedVenueAdmin.isNew) {
                $scope.selectedVenueAdmin.isNew = false;
                $scope.selectedVenue.admins.push($scope.selectedVenueAdmin);
            } else {
                $scope.selectedVenue.admins[$scope.selectedVenueAdminIndex] = $scope.selectedVenueAdmin;
            }
            $scope.selectedVenueAdmin = {};
            $scope.originalAdmin = {};
        }
        ;

        function revertEditingAdmin() {
            $scope.editAdminMode = false;
            $scope.selectedVenueAdminIndex = -1;
        }
        ;

        //venue types, it would be nice to cache this values somehow
        function getVenueTypes() {

            console.log('get venue types');

            VenueTypes.query().then(function (data) {
                vm.venueTypeList = data;
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Cannot load venue types. Connection to server Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        }
        ;

        //space types - it would be nice to cache this values somehow

        function getSpaceTypes() {

            console.log('get space types');

            SpaceTypes.query().then(function (data) {
                $scope.spaceTypeList = data;
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Cannot load space types. Connection to server Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        }
        ;
        //amenities - it would be nice to cache this values somehow

        function getAmenities() {

            console.log('get amenities');

            Amenities.query().then(function (data) {
                $scope.amenitiesList = data;
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Cannot load amenities. Connection to server Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        }
        ;

    }]);

app.controller('VenuesCreateController', ['servicesUrls', '$scope', '$http', '$state', '$log', 'Venues',
    function (servicesUrls, $scope, $http, $state, $log, Venues) {

        $scope.messageVenue = 'hello from venues VenuesCrateController';
        $log.log($scope.messageVenue);

         //TODO change for a function to pull types from api
        $scope.venueTypeList = ['Bussiness Center', 'Corporate Office', 'Coworking spaces', 'Startup offices'];

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

            $http.post(servicesUrls.baseUrl + 'venues', $scope.newVenueObj)
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
