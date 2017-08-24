(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ninetyDayForecastController', ninetyDayForecastController);

    /* @ngInject */
    function ninetyDayForecastController($mdDialog, $location, $document, NinetyDayForecastService) {
        var vm = this;
        vm.timeSpans = [{
            name: 'Daily',
            value: 'days'
        },{
            name: 'Weekly',
            value: 'weeks'
        },{
            name: 'Monthly',
            value: 'months'
        }];
        vm.ninetyDayForecastTimeSpanChanged = ninetyDayForecastTimeSpanChanged;

        function init() {
            vm.start = moment();
            vm.end = moment().add(90, 'days');
            vm.activeTimeSpan = vm.timeSpans[0];
            getForecastData(vm.start, vm.end, vm.activeTimeSpan.value);
        }
        function getForecastData(start, end, span) {
            vm.forecastData = NinetyDayForecastService.getForecastData(start, end, span);
            vm.ninetyDayForecastOptions = {
                chart: {
                    type: 'lineChart',
                    x: function(d){
                        return d[0];
                    },
                    y: function(d){
                        return d[1];
                    },
                    color: ['#039be5'],
                    xAxis: {
                        tickFormat: function(d) {
                            return d3.time.format('%B %d')(new Date(d));
                        },
                        showMaxMin: false
                    },

                    yAxis: {
                        tickFormat: function(d){
                            return d3.format('.0f')(d);
                        },
                        domain: [0, 100000]
                    }
                }
            };
        }
        function ninetyDayForecastTimeSpanChanged(span) {
            vm.activeTimeSpan = span;
            // create new data
            getForecastData(vm.start, vm.end, vm.activeTimeSpan.value);

        }

        // init
        init();

    }
})();
