(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('LookbackService', LookbackService);

    /* @ngInject */

    function LookbackService($http,$q) {
        var service = {
            getLookbackData: getLookbackData
        };

        return service;

        function getLookbackData(API_CONFIG) {
            var lookback = $http.get(API_CONFIG.url + 'lookback');
            return $q.all([lookback]);
        }

    }
})();
