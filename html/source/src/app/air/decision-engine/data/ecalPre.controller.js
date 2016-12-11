(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalPreDEController', ecalPreDEController);

    /* @ngInject */
    function ecalPreDEController($interval, $http) {
        var vm = this;
        vm.ecalPre = [];
        $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime())
        .then(function(ecalPreResponse) {
            vm.ecalPre = ecalPreResponse.data;
            vm.ecalPre.push(vm.ecalPre);
            vm.ecalPreList = ecalPreResponse.data[0].list;
            vm.ecalPreCurPage = 1;
            vm.ecalPreLimitOptions = [6,12,24];
            vm.ecalPrePageSize = 12;
        });
    }
})();
