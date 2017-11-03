(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.ecal', {
            url: '/earnings-calendar',
            templateUrl: 'app/air/earnings-calendar/earnings-calendar.html'
        })
        .state('triangular.ecalPre', {
            url: '/ecalPre',
            templateUrl: 'app/air/ecal-pre/ecalPre.html'
        })
        .state('triangular.ecalAfter', {
            url: '/ecalAfter',
            templateUrl: 'app/air/ecal-after/ecalAfter.html'
        })
        .state('triangular.ecalSnapshot', {
            url: '/ecalSnapshot',
            templateUrl: 'app/air/ecal-snapshot/ecalSnapshot.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Earnings Calendar',
            icon: 'zmdi zmdi-calendar',
            type: 'dropdown',
            priority: 1.2,
            children: [{
                name: 'Calendar Movers',
                type: 'link',
                state: 'triangular.ecal'
            },
            {
                name: 'Pre Market Movers',
                type: 'link',
                state: 'triangular.ecalPre'
            },
            {
                name: 'After Market Movers',
                type: 'link',
                state: 'triangular.ecalAfter'
            },
            {
                name: 'Calendar Snapshot',
                type: 'link',
                state: 'triangular.ecalSnapshot'
            }]
        });
    }
})();
