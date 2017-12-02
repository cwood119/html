(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.forecast', {
            url: '/forecast',
            templateUrl: 'app/air/decision-engine/forecast.html'
        })
        .state('triangular.chart', {
            url: '/chart',
            templateUrl: 'app/air/chart/chart.html'
        })
        .state('triangular.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/air/decision-engine/dashboard.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Decision Engine',
            icon: 'zmdi zmdi-compass',
            priority: 1,
            type: 'dropdown',
            children: [{
                name: 'Dashboard',
                type: 'link',
                state: 'triangular.dashboard'
            },
            {
                name: 'Chart',
                type: 'link',
                state: 'triangular.chart'
            }]
        });
    }
})();
