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

    clientModule.factory('VenuesGeoSearch', function ($resource, servicesUrls) {
        return $resource(servicesUrls.findVenuesUrl,
                {
                    //apiKey: '4fb51e55e4b02e56a67b0b66',
                    latitude: '@lat',
                    longitude: '@lon',
                    radiometers: '@radio'
                });
    });

    clientModule.service('spacesService', function (SpacesCrud) {
        var spacesService = {};

        spacesService.findAll = function () {
            return SpacesCrud.query();
            
        };

        spacesService.findById = function (id) {
            return SpacesCrud.get({id: id});
        };

        return spacesService;
    });
    
    clientModule.service('venuesService', function (VenuesGeoSearch) {
        var venuesService = {};

        venuesService.geoSearch = function (lat, lon, radio) {
            return VenuesGeoSearch.query({latitude: lat, longitude: lon, radiometers: radio});
        };

        return venuesService;
    });

})();



