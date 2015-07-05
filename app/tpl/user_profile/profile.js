'use strict';

/* Controllers */

app.controller('ProfileViewController', ['auth', '$scope', '$http', '$state', '$log', '$stateParams', 'Users', 'servicesUrls',
    function (auth, $scope, $http, $state, $log, $stateParams, Users, servicesUrls) {
        $scope.message = 'hello from venues ProfileViewController';
        $log.log($scope.message);

//        $scope.user = {};
//
//        Users.getById($stateParams.profileId).then(
//                function (v) {
//                    $scope.user = v;
//                },
//                function (err) {
//                    alert('error:' + err);
//                }
//        );
//        $scope.containsGoogleIdentity = function () {
//            var found = false;
//            for (var i = 0; i < auth.profile.identities.length; i++) {
//                if (auth.profile.identities[i].provider === 'google-oauth2') {
//                    found = true;
//                    break;
//                }
//            }
//            
//            return found;
//        };
//        
//        $scope.containsFbIdentity = function () {
//            var found = false;
//            for (var i = 0; i < auth.profile.identities.length; i++) {
//                if (auth.profile.identities[i].provider === 'facebook') {
//                    found = true;
//                    break;
//                }
//            }
//            
//            return found;
//        };
        
        


        $scope.edit = function (profile) {

            $http.post(servicesUrls.baseUrl + 'users', profile)
                    .success(function (data, status, headers) {
                        //succesfull login

                        console.log('user updated.');
                        alert("Profile Updated successfully.");

                    })
                    .error(function (data, status) {
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                        if (status === 0) {
                            alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                            return;
                        } else {
                            alert(status);
                        }
                    });



        };

//        $scope.addPhone = function () {
//            $scope.user.phoneNumbers.push("");
//        };
//
//        $scope.removePhone = function (todo) {
//            $scope.user.phoneNumbers.splice($scope.user.phoneNumbers.indexOf(todo), 1);
//        };

    }]);