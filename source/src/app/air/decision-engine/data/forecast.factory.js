(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ForecastService', ForecastService);

    /* @ngInject */

    function ForecastService($http,$q) {
        var service = {
            getForecastData: getForecastData
        };

        return service;

        function getForecastData(API_CONFIG) {
            var forecast = $http.get(API_CONFIG.url + 'ecalForecast');
            return $q.all([forecast]);
        }

    }
})();
