(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('counterWidgetService', counterWidgetService);

    /* @ngInject */

    function counterWidgetService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalIntraday = $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime());
            var ecalPre = $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime());
            var ecalAfter = $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime());
            var gainersIntraday = $http.get('app/air/decision-engine/data/gainers-intraday-data.json?ts='+new Date().getTime());
                
            return $q.all([ecalIntraday,ecalPre,ecalAfter,gainersIntraday]);
        }
    }
})();
