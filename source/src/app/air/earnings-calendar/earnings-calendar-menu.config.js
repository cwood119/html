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
            }]
        });
    }
})();
