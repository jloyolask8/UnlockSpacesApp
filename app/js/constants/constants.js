/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var constantsModule = angular.module('constants',[]);
    constantsModule.constant('servicesUrls', {
        findSpacesUrl: 'http://localhost\\:8090/unlockServices/search/findspaces/searchSpacesLatLong/:latitude/:longitude/:radiometers',
        spacesCrudUrl: 'http://localhost\\:8090/unlockServices/api/spaces/:id',
    });
})();

