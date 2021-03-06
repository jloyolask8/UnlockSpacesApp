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
    
    clientModule.factory('VenuesSearch', function($resource, servicesUrls) {
        return $resource(servicesUrls.onlyViewVenuesUrl, {
            id: '@id'
        });
    });
    
    clientModule.factory('VenuesEdit', function($resource, servicesUrls) {
        return $resource(servicesUrls.venuesCrudUrl, {
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
    
    clientModule.factory('VenuesAvailableGeoSearch', function ($resource, servicesUrls) {
        return $resource(servicesUrls.findVenuesAvailablesUrl,
                {
                    //apiKey: '4fb51e55e4b02e56a67b0b66',
                    latitude: '@lat',
                    longitude: '@lon',
                    radiometers: '@radio',
                    start: '@start',
                    end: '@end'
                });
    });
    
    clientModule.factory('ReservationSearch', function ($resource, servicesUrls) {
        return $resource(servicesUrls.reservationsUrl,{});
    });
    
    clientModule.factory('ReservationSearchByAdmin', function ($resource, servicesUrls) {
        return $resource(servicesUrls.reservationsByAdminUrl,{});
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
    
    clientModule.service('venuesService', function (VenuesGeoSearch, VenuesSearch, VenuesAvailableGeoSearch) {
        var venuesService = {};

        venuesService.geoSearch = function (lat, lon, radio) {
            return VenuesGeoSearch.query({latitude: lat, longitude: lon, radiometers: radio});
        };
        
        venuesService.geoSearchAvailable = function (lat, lon, radio, start, end) {
            return VenuesAvailableGeoSearch.query({latitude: lat, longitude: lon, radiometers: radio, start: start, end: end});
        };
        
        venuesService.find = function (id){
            return VenuesSearch.get({id: id});
        };

        return venuesService;
    });
    
    clientModule.service('reservationsService', function (ReservationSearch, ReservationSearchByAdmin) {
        var reservationsService = {};

        reservationsService.findReservationsByUserId = function () {
            return ReservationSearch.query();
        };
        
        reservationsService.findReservationsByAdminId = function () {
            return ReservationSearchByAdmin.query();
        };
        
        return reservationsService;
    });

})();



