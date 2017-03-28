(function() {
    'use strict';

    angular
        .module('app.air.market-movers')
        .factory('moversService', moversService);

    /* @ngInject */

    function moversService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var moversData = $http.get('app/air/market-movers/data/data.json?ts='+new Date().getTime());
            return $q.all([moversData]);
        }
    }
})();
