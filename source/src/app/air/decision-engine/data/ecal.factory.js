(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ecalDailyService', ecalDailyService);

    /* @ngInject */

    function ecalDailyService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalDailyData = $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime());
            var ecalData = $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime());
            return $q.all([ecalDailyData,ecalData]);
        }
    }
})();
