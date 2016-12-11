(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('decisionController', decisionController);

    /* @ngInject */
    function decisionController($http, $mdDialog, $location, $document, $timeout, $mdToast, $interval, DashboardService) {
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
        vm.timeSpanChanged = timeSpanChanged;

        function init() {
            vm.start = moment().subtract(30, 'days');
            vm.end = moment();
            vm.activeTimeSpan = vm.timeSpans[0];
            getData(vm.start, vm.end, vm.activeTimeSpan.value);
        }
        function getData(start, end, span) {
            vm.data = DashboardService.getData(start, end, span);
//            vm.ecalData = DashboardService.getWidgetData();
            //console.log(vm.ecalData);
            vm.overviewLineChartOptions = {
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
        function timeSpanChanged(span) {
            vm.activeTimeSpan = span;
            // create new data
            getData(vm.start, vm.end, vm.activeTimeSpan.value);
        }

        // init
        init();

        // Get current path.  Using this to show/hide before/after market announcement filter
        vm.currentPath = $location.path();
    }
})();
