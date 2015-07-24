/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var constantsModule = angular.module('constants', []);
    

    //var baseServerAddress = 'www.unlockspaces.com';
    var baseServerPort = '8090';

    var baseServerAddress = 'localhost';
//    var baseServerPort = '8080';

    var appContext = 'unlockServices';
    
//    searchVenuesLatLongTimeRange/{latitude}/{longitude}/{radiometers}/{start}/{end}
    
    constantsModule.constant('servicesUrls', {
        baseUrl: 'http://'+baseServerAddress+':'+baseServerPort+'/'+appContext+'/api/',
        cloudinaryBaseUrl: '',
        findSpacesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
        findVenuesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/search/findspaces/searchVenuesLatLong/:latitude/:longitude/:radiometers',
        findVenuesAvailablesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/search/findspaces/searchVenuesLatLongTimeRange/:latitude/:longitude/:radiometers/:start/:end',
        spacesCrudUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/api/spaces/:id',
        venuesCrudUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/api/venues/:id',
        onlyViewVenuesUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/search/venues/:id',
        reservationsUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/api/reservations/findReservationsByUserId',
        reservationsByAdminUrl: 'http://'+baseServerAddress+'\\:'+baseServerPort+'/'+appContext+'/api/reservations/findReservationsByAdminId'
    });
})();

