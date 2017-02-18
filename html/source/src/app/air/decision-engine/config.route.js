(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider) {
        // Setup the apps routes
        $stateProvider
        .state('widgets', {
            resolve: {
                widgets: function($http){
                    return $http({method: 'GET', url: 'app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime()})
                                .then(function(response){
                                    return response.data;
                                });
                }
            }
        });
    }
})();
