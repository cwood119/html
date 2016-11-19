(function() {
    'use strict';
    angular
        .module('app.air.watchlist')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.watchlist', {
            url: '/watchlist',
            templateUrl: 'app/air/watchlist/watchlist.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Watchlist',
            icon: 'fa fa-list-alt',
            type: 'link',
            state: 'triangular.watchlist',
            priority: 1.1
        });
    }
})();
