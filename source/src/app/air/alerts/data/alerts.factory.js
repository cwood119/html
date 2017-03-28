(function() {
    'use strict';

    angular
        .module('app.air.alerts')
        .factory('alertsService', alertsService);

    /* @ngInject */

    function alertsService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var alertsData = $http.get('app/air/alerts/data/data.json?ts='+new Date().getTime());
            return $q.all([alertsData]);
        }
    }
})();
