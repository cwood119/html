(function() {
    'use strict';

    angular
        .module('app.air.watchlist')
        .factory('watchlistService', watchlistService);

    /* @ngInject */

    function watchlistService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var watchlistData = $http.get('app/air/watchlist/data/data.json?ts='+new Date().getTime());
            return $q.all([watchlistData]);
        }
    }
})();
