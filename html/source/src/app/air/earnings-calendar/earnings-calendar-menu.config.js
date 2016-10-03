(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.nightly', {
            url: '/earnings-calendar',
            templateUrl: 'app/air/earnings-calendar/earnings-calendar.html'
        })
        .state('triangular.earnings-calendar-update', {
            url: '/earnings-calendar-update',
            templateUrl: 'app/air/earnings-calendar/earnings-calendar-update.html'
        })
        .state('triangular.pre-market', {
            url: '/pre-market',
            templateUrl: 'app/air/earnings-calendar/pre-market.html'
        })
        .state('triangular.after-market', {
            url: '/after-market',
            templateUrl: 'app/air/earnings-calendar/after-market.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Earnings Calendar',
            icon: 'zmdi zmdi-calendar',
            type: 'dropdown',
            priority: 1.2,
            children: [{
                name: 'Nightly Calendar',
                type: 'link',
                state: 'triangular.nightly'
            },
            {
                name: 'Calendar Update',
                type: 'link',
                state: 'triangular.earnings-calendar-update'
            },
            {
                name: 'Pre Market',
                type: 'link',
                state: 'triangular.pre-market'
            },
            {
                name: 'After Market',
                type: 'link',
                state: 'triangular.after-market'
            }]
        });
    }
})();
