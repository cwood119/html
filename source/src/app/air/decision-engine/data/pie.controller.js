(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ChartJsPieController', ChartJsPieController);

    /* @ngInject */
    function ChartJsPieController($interval, $http) {
        var vm = this;
        vm.gainersIntraday = [];
        vm.ecalIntraday = [];

        vm.labels = ['Market Movers', 'Calendar Movers'];
        vm.options = {
            datasetFill: false
        };

        $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime())
        .then(function(intradayResponse) {
            vm.ecalIntraday = intradayResponse.data;
            vm.ecalIntradayList = intradayResponse.data[0].list;
            vm.ecalIntradayCurPage = 1;
            vm.ecalIntradayLimitOptions = [6,12,24];
            vm.ecalIntradayPageSize = 12;
            getGainers();
        });

        function getGainers() {
            $http.get('app/air/decision-engine/data/gainers-intraday-data.json?ts='+new Date().getTime())
            .then(function(gainersResponse) {
                vm.gainersIntraday = gainersResponse.data;
                vm.gainersIntradayList = gainersResponse.data[0].list;
                vm.gainersIntradayCurPage = 1;
                vm.gainersIntradayLimitOptions = [6,12,24];
                vm.gainersIntradayPageSize = 12;
                getData();
            });
        }

        function getData() {
            vm.data = [];
            for(var label = 0; label < vm.labels.length; label++) {
                if (label == 0) {
                    vm.data.push(vm.gainersIntraday.length); 
                }
                if (label == 1) {
                    vm.data.push(vm.ecalIntraday.length); 
                }
            }
        }

        // init

        // getData();

        // Simulate async data update
        $interval(getData, 2000);
    }
})();
