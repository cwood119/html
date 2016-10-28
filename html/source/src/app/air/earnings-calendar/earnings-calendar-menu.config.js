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
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Earnings Calendar',
            icon: 'zmdi zmdi-calendar',
            type: 'link',
            state: 'triangular.ecal',
            priority: 1.2
        });
    }
})();
