/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var constantsModule = angular.module('constants', []);
    
    var baseServerAddress = 'localhost';
    var baseServerPort = '8090';
    
    constantsModule.constant('servicesUrls', {
//        baseUrl: 'http://localhost:8080/UnlockServices/api/',
//        cloudinaryBaseUrl: '',
//        findSpacesUrl: 'http://localhost\\:8080/UnlockServices/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
//        spacesCrudUrl: 'http://localhost\\:8080/UnlockServices/api/spaces/:id',
//        findVenuesUrl: 'http://localhost\\:8080/UnlockServices/search/findspaces/searchVenuesLatLong/:latitude/:longitude/:radiometers',
//        venuesCrudUrl: 'http://localhost\\:8080/UnlockServices/api/venues/:id',
        baseUrl: 'http://'+baseServerAddress+':'+baseServerPort+'/unlockServices/api/',
        cloudinaryBaseUrl: '',
        findSpacesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/unlockServices/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
        findVenuesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/unlockServices/search/findspaces/searchVenuesLatLong/:latitude/:longitude/:radiometers',
        spacesCrudUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/unlockServices/api/spaces/:id',
        venuesCrudUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/unlockServices/api/venues/:id',
        onlyViewVenuesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/unlockServices/search/venues/:id'
    });
})();

