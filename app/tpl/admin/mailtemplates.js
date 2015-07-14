'use strict';

app.controller('MailTemplateController', ['servicesUrls', '$scope', '$http', '$state', '$log', '$stateParams', 'MailTemplate',
    function (servicesUrls, $scope, $http, $state, $log, $stateParams, MailTemplate) {
        $scope.messageVenue = 'hello from MailTemplateController';
        $log.log($scope.messageVenue);
        $scope.ready = false;

        $scope.indexOfTemplate = function (templateName) {
            for (var i = 0; i < $scope.templates.length; i++) {
                if ($scope.templates[i].name === templateName) {
                    return i;
                }
            }
            //return 0;
        };

        $scope.fetchAll = function () {

            console.log('loading mailTemplates... ');

            MailTemplate.query().then(function (templates) {
                $scope.templates = templates;
                console.log('done loading mailTemplates');
                $scope.ready = true;
            }, function (errResponse) {
                if (errResponse.status === 0) {
                    alert("Connection Lost!");
                } else {
                    alert("Sorry we are not able to complete the operation. " + errResponse.status);
                }
            });

        };

        $scope.fetchAll();

        $scope.edit = function () {
            for (var i = 0; i < $scope.templates.length; i++) {
                console.log("saving "+$scope.templates[i].name);
                $http.put(servicesUrls.baseUrl + 'mailtemplates' + '/' + $scope.templates[i].name, $scope.templates[i])
                        .success(function (data, status, headers) {

                            $scope.headers = headers;
                            $scope.data = data;
                            $scope.status = status;

                            //$state.go("app.yourlistings");

                        })
                        .error(function (data, status) {
                            $scope.data = data || "Request failed";
                            $scope.status = status;
                            if (status === 0) {
                                alert("Sorry we are not able to complete the operation. Connection to the server is lost.");
                                return;
                            }

                        });
            }

        };


    }]);