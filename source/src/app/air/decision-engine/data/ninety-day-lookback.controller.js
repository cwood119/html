(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ninetyDayLookbackController', ninetyDayLookbackController);

    /* @ngInject */
    function ninetyDayLookbackController($http, $mdDialog, $location, $document, $timeout, $mdToast, $interval, NinetyDayLookbackService) {
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
        vm.ninetyDayLookbackTimeSpanChanged = ninetyDayLookbackTimeSpanChanged;

        function init() {
            vm.start = moment().subtract(90, 'days');
            vm.end = moment();
            vm.activeTimeSpan = vm.timeSpans[0];
            getLookbackData(vm.start, vm.end, vm.activeTimeSpan.value);
        }
        function getLookbackData(start, end, span) {
            vm.lookbackData = NinetyDayLookbackService.getLookbackData(start, end, span);
//            vm.ecalData = DashboardService.getWidgetLookbackData();
            //console.log(vm.ecalData);
            vm.ninetyDayLookbackOptions = {
                chart: {
                    type: 'lineChart',
                    x: function(d){
                        return d[0];
                    },
                    y: function(d){
                        return d[1];
                    },
                    color: ['#82B1FF'],
                    xAxis: {
                        tickFormat: function(d) {
                            return d3.time.format('%m/%d/%y')(new Date(d));
                        },
                        showMaxMin: false
                    },

                    yAxis: {
                        tickFormat: function(d){
                            return d3.format(',')(d);
                        },
                        domain: [0, 100000]
                    }
                }
            };
        }
        function ninetyDayLookbackTimeSpanChanged(span) {
            vm.activeTimeSpan = span;
            // create new data
            getLookbackData(vm.start, vm.end, vm.activeTimeSpan.value);
        }

        // init
        init();

    }
})();
