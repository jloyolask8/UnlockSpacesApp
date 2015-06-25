'use strict';

/* Controllers */
// signin controller

app.controller('LoginCtrl', function (auth, $scope, $state, $http, $location, store, Users, servicesUrls) {
//    $scope.user = '';
//    $scope.pass = '';

    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

    var showOptions = {
        container: 'root'
    };

    var onLoginSuccess = function (profile, token) {
        console.log('onLoginSuccess');

        store.set('profile', profile);
        store.set('token', token);
        
        auth.authenticate(store.get('profile'), token);


        $http.post(servicesUrls.baseUrl + 'users', profile)
                .success(function (data, status, headers) {
                    //succesfull login

                    console.log('user updated.');

                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    if (status === 0) {
                        alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                        return;
                    }
                });

        console.log('go to ' + auth.lastStateName);
        if (auth.lastStateName) {
            $state.go(auth.lastStateName, auth.toParams);
        } else {
            $state.go('app.dashboard');
        }

//        authService.loginConfirmed();

//        $state.go('app.dashboard');
//        $scope.loading = false;
    };


    var onLogin = function (err, profile, id_token) {
        if (err) {
//            return alert(err.message);
        } else {
            console.log(profile);
            onLoginSuccess(profile, id_token);
        }
        // User is logged in
    };

    lock.show(showOptions, onLogin);
});

