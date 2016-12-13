(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalIntradayDEController', ecalIntradayDEController);

    /* @ngInject */
    function ecalIntradayDEController($interval, $http) {
        var vm = this;
        vm.ecalIntraday = [];
        $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime())
        .then(function(ecalIntradayResponse) {
            vm.ecalIntraday = ecalIntradayResponse.data;
            vm.ecalIntradayList = ecalIntradayResponse.data[0].list;
            vm.ecalIntradayCurPage = 1;
            vm.ecalIntradayLimitOptions = [5,10,15];
            vm.ecalIntradayPageSize = 5;
        });
    }
})();
