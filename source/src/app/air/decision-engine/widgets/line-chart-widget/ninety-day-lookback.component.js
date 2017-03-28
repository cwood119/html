(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .component('ninetyDayLookbackWidget', {
            templateUrl: 'app/air/decision-engine/widgets/line-chart-widget/ninety-day-lookback.tmpl.html',
            controllerAs: 'vm',
            controller: NinetyDayLookbackWidgetController,
            bindings: {
                start: '<',
                end: '<',
                timeSpans: '<',
                onTimeChange: '&',
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function NinetyDayLookbackWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();
