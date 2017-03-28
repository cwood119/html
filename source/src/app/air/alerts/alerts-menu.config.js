(function() {
    'use strict';
    angular
        .module('app.air.alerts')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.alerts', {
            url: '/alerts',
            templateUrl: 'app/air/alerts/alerts.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Price Alerts',
            icon: 'zmdi zmdi-notifications',
            type: 'link',
            state: 'triangular.alerts',
            priority: 1.1
        });
    }
})();
