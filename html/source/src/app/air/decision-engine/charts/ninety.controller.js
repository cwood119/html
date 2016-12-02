(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .controller('ninetyController', ninetyController);

    /* @ngInject */
    function ninetyController() {
        var vm = this;
        vm.barChart = {
            type: 'Bar',
            data: [
                ['', ''],
                ['September', 100],
                ['October', 600],
                ['November', 2300]
            ],
            options: {
                chart: {
                    title: '90 Day Forecast'
                },
                bars: 'vertical',
                width: '100%',
                height: '400',
                legend: { position: 'none' }
            }
        };
    }
})();
