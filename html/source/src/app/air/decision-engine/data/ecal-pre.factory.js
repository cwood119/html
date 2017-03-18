(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ecalPreService', ecalPreService);

    /* @ngInject */

    function ecalPreService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalPreData = $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime());
            var ecalData = $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime());
            return $q.all([ecalPreData,ecalData]);
        }
    }
})();
