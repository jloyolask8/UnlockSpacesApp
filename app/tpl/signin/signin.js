'use strict';

/* Controllers */
// signin controller

app.controller('LoginCtrl', function (auth, $scope, $state, $http, $location, store, Users, servicesUrls) {
//    $scope.user = '';
//    $scope.pass = '';

    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

    var onLoginSuccess = function (profile, token) {
//        $scope.$parent.userloggedin = true;
        console.log('onLoginSuccess');
        
        store.set('profile', profile);
        store.set('token', token);


        $http.post(servicesUrls.baseUrl + 'users', profile)
                .success(function (data, status, headers) {

                    

                    $state.go('app.dashboard');

                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    if (status === 0) {
                        alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                        return;
                    }

                    $state.go('home');

                });

//        $state.go('app.dashboard');
//        $scope.loading = false;
    }
    ;

    var showOptions = {
        container: 'root'
    };

    var onLogin = function (err, profile, id_token) {
        if (err) {
            // There was an error logging the user in
//            return alert(err.message);
        } else {
            console.log(profile);
            onLoginSuccess(profile, id_token);
        }
        // User is logged in
    };

    lock.show(showOptions, onLogin);



//    function onLoginFailed() {
//        $scope.message = 'invalid credentials';
//        $scope.loading = false;
//    };
//
//    $scope.reset = function () {
//        auth.reset({
//            email: 'hello@bye.com',
//            password: 'hello',
//            connection: 'Username-Password-Authentication'
//        });
//    };
//
//    $scope.login = function () {
//        $scope.message = 'loading...';
//        $scope.loading = true;
//        auth.signin({
//            connection: 'Username-Password-Authentication',
//            username: $scope.user,
//            password: $scope.pass,
//            authParams: {
//                scope: 'openid name email'
//            }
//        }, onLoginSuccess, onLoginFailed);
//
//    };
//
//    $scope.doGoogleAuthWithPopup = function () {
//        $scope.message = 'loading...';
//        $scope.loading = true;
//
//        auth.signin({
//            popup: true,
//            connection: 'google-oauth2',
//            scope: 'openid name email'
//        }, onLoginSuccess, onLoginFailed);
//    };

});


app.controller('SigninFormController', ['servicesUrls', '$scope', '$http', '$state', '$window', 'authService', function (servicesUrls, $scope, $http, $state, $window, authService) {
        $scope.user = {};
        $scope.message = '';

        $scope.loginParams = {
            username: '',
            password: ''
        };


        $scope.login = function () {
            // Try to login
            $http.post(servicesUrls.baseUrl + 'AuthenticationService/login', $scope.loginParams)

                    .success(function (data, status, headers, config) {

                        if (!data.auth_token) {//No login
                            $scope.message = 'Please check your username or password.';

                            authService.loginCancelled();

                        } else {
                            $window.sessionStorage.auth_token = data.auth_token;
                            $scope.message = 'Welcome';
                            authService.loginConfirmed();
                        }

                    })
                    .error(function (data, status, headers, config) {
                        // Erase the token if the user fails to log in


                        // Handle login errors here
                        $scope.message = 'Error: Invalid user or password: ' + status;
                    });
//                    .then(function (response) {
//                        if (!response.data.auth_token) {
////                            if (!response.data.user) {
//                            $scope.message = 'Please check your username or password.';
//                            $window.sessionStorage.auth_token = null;
//                        } else {
//                            $window.sessionStorage.auth_token = response.data.auth_token;
////                        $http.defaults.headers.common.auth_token = response.data.auth_token;
//                            authService.loginConfirmed();
//                        }
//                    }, function (errResponse) {
//                        $scope.message = 'Server Error: ' + errResponse.data.status;
//                        $window.sessionStorage.auth_token = null;
//                    });
        };
    }]
        );
