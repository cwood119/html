(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .component('ninetyDayForecastWidget', {
            templateUrl: 'app/air/decision-engine/widgets/line-chart-widget/ninety-day-forecast.tmpl.html',
            controllerAs: 'vm',
            controller: NinetyDayForecastWidgetController,
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
    function NinetyDayForecastWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();
