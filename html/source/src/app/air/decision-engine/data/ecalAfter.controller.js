(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalAfterDEController', ecalAfterDEController);

    /* @ngInject */
    function ecalAfterDEController($interval, $http) {
        var vm = this;
        vm.ecalAfter = [];
        $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime())
        .then(function(ecalAfterResponse) {
            vm.ecalAfter = ecalAfterResponse.data;
            vm.ecalAfterList = ecalAfterResponse.data[0].list;
            vm.ecalAfterCurPage = 1;
            vm.ecalAfterLimitOptions = [5,10,15];
            vm.ecalAfterPageSize = 5;
        });
    }
})();
