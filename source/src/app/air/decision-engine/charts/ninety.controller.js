(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .controller('barController', barController);

    /* @ngInject */
    function barController() {
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
                bars: 'vertical',
                width: '100%',
                legend: { position: 'none' },
                colors: ['#03A9F4'],
            }
        };
    }
})();
