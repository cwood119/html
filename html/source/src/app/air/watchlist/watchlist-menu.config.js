(function() {
    'use strict';
    angular
        .module('app')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.watchlist', {
            url: '/watchlist',
            templateUrl: 'app/watchlist/watchlist.html'
        })

        .state('triangular.price-alerts', {
            url: '/price-alerts',
            templateUrl: 'app/watchlist/price-alerts.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Watchlist',
            icon: 'zmdi zmdi-format-list-numbered',
            type: 'dropdown',
            priority: 1.0,
            children: [{
                name: 'Watchlist',
                type: 'link',
                state: 'triangular.watchlist'
            },
            {
                name: 'Price Alerts',
                type: 'link',
                state: 'triangular.price-alerts'
            }]
        });
    }
})();
