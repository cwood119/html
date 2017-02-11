(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('counterWidgetsController', counterWidgetsController);

    /* @ngInject */

    function counterWidgetsController($http, counterWidgetService) {
        var vm = this;
        vm.ecalIntraday = [];
        vm.ecalPre = [];
        vm.ecalAfter = [];
        vm.gainersIntraday = [];

        activate();

        function activate() {
            return getCounterData().then(function(data) {
                vm.ecalIntraday = data[0].data;
                vm.ecalPre = data[1].data;
                vm.ecalAfter = data[2].data;
                vm.gainersIntraday = data[3].data;
            });
        }

        function getCounterData() {
            return counterWidgetService.getData()
                .then(function(data) {
                    //var data = [vm.ecalIntraday,vm.ecalPre];
                    return data;
                });
        }
    }
})();
