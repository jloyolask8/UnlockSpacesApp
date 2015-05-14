/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var constantsModule = angular.module('constants',[]);
    constantsModule.constant('servicesUrls', {
        findSpacesUrl: 'http://localhost\\:8080/UnlockServices/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
        spacesCrudUrl: 'http://localhost\\:8080/UnlockServices/api/spaces/:id',
//        findSpacesUrl: 'http://localhost\\:8090/unlockServices/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
        findVenuesUrl: 'http://localhost\\:8080/UnlockServices/search/findspaces/searchVenuesLatLong/:latitude/:longitude/:radiometers',
//        spacesCrudUrl: 'http://localhost\\:8080/unlockServices/api/spaces/:id',
        venuesCrudUrl: 'http://localhost\\:8080/UnlockServices/api/venues/:id',
    });
})();

