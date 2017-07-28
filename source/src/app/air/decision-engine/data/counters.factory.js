(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('countersService', countersService);

    /* @ngInject */

    function countersService($http, $q) {

        var service = {
            getListData: getListData
        };

        return service;

        function getListData(API_CONFIG) {
            var gainers = $http.get(API_CONFIG.url + 'gainers');
            var ecal = $http.get(API_CONFIG.url + 'ecal');
            return $q.all([ecal,gainers]);
        }

    }
})();
