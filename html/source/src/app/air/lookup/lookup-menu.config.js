(function() {
    'use strict';
    angular
        .module('app.air.lookup')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.lookup', {
            url: '/lookup',
            templateUrl: 'app/air/lookup/lookup.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Symbol Lookup',
            icon: 'zmdi zmdi-search',
            type: 'link',
            state: 'triangular.lookup',
            priority: 1.3
        });
    }
})();
