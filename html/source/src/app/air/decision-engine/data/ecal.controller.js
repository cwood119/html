(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalDEController', ecalDEController);

    /* @ngInject */
    function ecalDEController($interval, $http) {
        var vm = this;
        vm.ecalDaily = [];
        $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
        .then(function(ecalResponse) {
            vm.ecalDaily = ecalResponse.data;
            vm.ecalDaily.push(vm.ecalDaily);
            vm.ecalList = ecalResponse.data[0].list;
            vm.ecalCurPage = 1;
            vm.ecalLimitOptions = [6,12,24];
            vm.ecalPageSize = 12;
        });
    }
})();
