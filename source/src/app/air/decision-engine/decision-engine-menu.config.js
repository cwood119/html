(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/air/decision-engine/dashboard.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Decision Engine',
            icon: 'zmdi zmdi-compass',
            priority: 1,
            type: 'link',
            state: 'triangular.dashboard'
        });
    }
})();
