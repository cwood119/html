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
            vm.ecalPreList = ecalPreResponse.data[0].list;
            vm.ecalPreCurPage = 1;
            vm.ecalPreLimitOptions = [5,10,15];
            vm.ecalPrePageSize = 5;
        });
    }
})();
