(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('HeatmapService', HeatmapService);

    /* @ngInject */

    function HeatmapService($http,$q) {
        var service = {
            getHeatmapData: getHeatmapData
        };

        return service;

        function getHeatmapData(API_CONFIG) {
            var heatmap = $http.get(API_CONFIG.url + 'heatmap');
            return $q.all([heatmap]);
        }

    }
})();
