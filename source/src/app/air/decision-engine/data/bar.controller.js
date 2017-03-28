(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ChartJsBarController', ChartJsBarController);

    /* @ngInject */
    function ChartJsBarController($interval, $http) {
        var vm = this;
        vm.series = ['Announcements'];

        function getNinety() {
            $http.get('app/air/decision-engine/data/ninety-data.json?ts='+new Date().getTime())
            .then(function(ninetyResponse) {
                vm.one = ninetyResponse.data[0].count;
                vm.two = ninetyResponse.data[1].count;
                vm.three = ninetyResponse.data[2].count;
                vm.labels = [ninetyResponse.data[0].month, ninetyResponse.data[1].month, ninetyResponse.data[2].month];
                getData();
            });
        }

        function getData() {
            vm.data = [];
            for(var series = 0; series < vm.series.length; series++) {
                var row = [];
                for(var label = 0; label < vm.labels.length; label++) {
                    if (label == 0) {row.push(vm.one);}
                    if (label == 1) {row.push(vm.two);}
                    if (label == 2) {row.push(vm.three);}
                }
                vm.data.push(row);
            }
        }

        // Simulate async data update
        $interval(getNinety, 2500);
    }
})();
