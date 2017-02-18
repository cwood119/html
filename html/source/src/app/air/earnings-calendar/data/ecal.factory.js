(function() {
    'use strict';

    angular
        .module('app.air.earnings-calendar')
        .factory('ecalService', ecalService);

    /* @ngInject */

    function ecalService($http, $q) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            var ecalData = $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime());
            return $q.all([ecalData]);
        }
    }
})();
