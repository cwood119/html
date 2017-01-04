(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('gainersDEController', gainersDEController);

    /* @ngInject */
    function gainersDEController($interval, $http) {
        var vm = this;
        vm.gainersIntraday = [];
        $http.get('app/air/decision-engine/data/gainers-intraday-data.json?ts='+new Date().getTime())
        .then(function(gainersResponse) {
            var symbol=gainersResponse.data[0].symbol;
            vm.gainersIntraday = gainersResponse.data;
            vm.gainersList = gainersResponse.data[0].list;
            vm.gainersCurPage = 1;
            vm.gainersLimitOptions = [6,12,24];
            vm.gainersPageSize = 12;
            if (symbol == '') {vm.gainersIntradayToggle=0;vm.gainersIntraday = [];}
        });
    }
})();
