(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('countersController', countersController);

    /* @ngInject */

    function countersController($http, countersService, API_CONFIG, $document, filterFilter) {
        var vm = this;
        vm.ecal = [];
        vm.ecalAfter = [];
        vm.ecalPre = [];
        vm.gainers = [];

        activate();

        function activate() {

            return getListData(API_CONFIG).then(function(data) {

                vm.ecal = data[0].data;
                vm.ecalPre= filterFilter(vm.ecal, { announce: '2' });
                vm.ecalAfter= filterFilter(vm.ecal, { announce: '1' });
                vm.gainers = data[1].data;

            });
        }

        function getListData(API_CONFIG) {
            return countersService.getListData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }
    }
})();
