(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ecalAfterService', ecalAfterService);

    /* @ngInject */

    function ecalAfterService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalAfterData = $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime());
            var ecalData = $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime());
            return $q.all([ecalAfterData,ecalData]);
        }
    }
})();
