/**
 * Module spaces-rest-client.js
 * provides a service to access space resources through a REST API
 * @requires angular-resource.js
 * 
 */
(function () {
    var clientModule = angular.module('spacesRestClient', ['ngResource','constants']);

    clientModule.factory('SpacesCrud', function ($resource,  servicesUrls) {
        return $resource(servicesUrls.spacesCrudUrl,
                {
                    //apiKey: '4fb51e55e4b02e56a67b0b66',
                    id: '@id'
                });
    });

    clientModule.factory('SpacesGeoSearch', function ($resource, servicesUrls) {
        return $resource(servicesUrls.findSpacesUrl,
                {
                    //apiKey: '4fb51e55e4b02e56a67b0b66',
                    latitude: '@lat',
                    longitude: '@lon',
                    radiometers: '@radio'
                });
    });

    clientModule.service('spacesService', function (SpacesCrud, SpacesGeoSearch) {
        var spacesService = {};

        spacesService.findAll = function () {
            return SpacesCrud.query();
            
        };

        spacesService.geoSearch = function (lat, lon, radio) {
            return SpacesGeoSearch.query({latitude: lat, longitude: lon, radiometers: radio});
        };

        spacesService.findById = function (id) {
            return SpacesCrud.get({id: id});
        };

        return spacesService;
    });

})();



