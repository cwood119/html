(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ecalIntradayService', ecalIntradayService);

    /* @ngInject */

    function ecalIntradayService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalIntradayData = $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime());
            var ecalData = $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime());
            return $q.all([ecalIntradayData,ecalData]);
        }
    }
})();
