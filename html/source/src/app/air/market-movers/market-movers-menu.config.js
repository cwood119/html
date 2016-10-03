(function() {
    'use strict';
    angular
        .module('app')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.market-movers', {
            url: '/market-movers',
            templateUrl: 'app/market-movers/market-movers.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Market Movers',
            icon: 'zmdi zmdi-trending-up',
            type: 'link',
	    state: 'triangular.market-movers',
            priority: 1.3
        });
    }
})();
