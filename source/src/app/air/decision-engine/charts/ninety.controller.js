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
                    title: 'Number of Announcements'
                },
                bars: 'vertical',
                width: '100%',
                legend: { position: 'none' }
            }
        };
    }
})();
