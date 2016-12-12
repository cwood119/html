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
            vm.ecalList = ecalResponse.data[0].list;
            vm.ecalCurPage = 1;
            vm.ecalLimitOptions = [5,10,15];
            vm.ecalPageSize = 5;
        });
    }
})();
