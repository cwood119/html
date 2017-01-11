(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('gainersDEController', gainersDEController);

    /* @ngInject */
    function gainersDEController($interval, $http) {
        var vm = this;
        vm.gainersIntraday = [];
        vm.gainersIntradayLength = null;
        $http.get('app/air/decision-engine/data/gainers-intraday-data.json?ts='+new Date().getTime())
        .success(function(data) {
            vm.gainersIntradayLength = data.length;
            vm.gainersIntraday = data;
        });
    }
})();
