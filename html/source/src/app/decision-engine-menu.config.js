(function() {
    'use strict';
    angular
        .module('app')
        .config(routeConfig);
    /* @ngInject */
    function routeConfig($stateProvider, triMenuProvider) {
        // first create a state that your menu will point to .
        $stateProvider
        .state('triangular.forecast', {
            url: '/forecast',
            templateUrl: 'app/decision-engine/forecast.html'
        })

        .state('triangular.pattern-recognition', {
            url: '/pattern-recognition',
            templateUrl: 'app/decision-engine/pattern-recognition.html'
        })
        .state('triangular.calculators', {
            url: '/calculators',
            templateUrl: 'app/decision-engine/calculators.html'
        });
        // next add the menu item that points to the above state.
        triMenuProvider.addMenu({
            name: 'Decision Engine',
            icon: 'zmdi zmdi-assignment-check',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'Forecast',
                type: 'link',
                state: 'triangular.forecast'
            },
            {
                name: 'Pattern Recognition',
                type: 'link',
                state: 'triangular.pattern-recognition'
            },
            {
                name: 'Calculators',
                type: 'link',
                state: 'triangular.calculators'
            }]
        });
    }
})();
