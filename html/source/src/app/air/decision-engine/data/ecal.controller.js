(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalDEController', ecalDEController);

    /* @ngInject */
    function ecalDEController($interval, $http, $mdDialog, $document, ecalDailyService) {
        var vm = this;

        // Page Variables
        vm.ecalDaily=[];
        vm.ecalLength=null;
        vm.ecalToggle=1;

        // Pagination Variables
        vm.ecalCurPage = 1;
        vm.ecalLimitOptions = [5,10,15];
        vm.ecalPageSize = 5;
        vm.query = {order: 'Symbol'};

        activate();

        //////////

        function activate() {
            return getEcalDailyData().then(function(data) {
                if (data[0].data.length != 0) {

                    // Get Symbol and Check for Empty Data Set
                    vm.ecalDaily = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}

                    // Get List
                    vm.list = data[0].data[0].list;

                    // Get Data Time Stamp
                    vm.updated = new Date(data[0].headers()['last-modified']).toLocaleString();

                } else {vm.ecalToggle=0;}
                // Hide if Active on Ecal Page
                if (data[1].data.length != 0) {
                    var list = data[1].data[1].list;
                    if (list == 'Earnings Calendar') {vm.ecalToggle=0;}
                }
            });
        }

        // Get Data from Service
        function getEcalDailyData() {
            return ecalDailyService.getData()
                .then(function(data) {
                    return data;
                });
        }

        // Vitals Modal
        vm.openVitals = function (e, symbol) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: function ($mdDialog) {
                    var vm = this;
                    vm.symbol = {};
                    vm.symbol = symbol;
                    vm.cancelClick = function () {
                        $mdDialog.cancel();
                    };
                },
                controllerAs: 'modal',
                templateUrl: 'app/air/templates/dialogs/vitals-dialog.tmpl.html',
                parent: angular.element($document.body),
                targetEvent: e
            });
        };

        // Headlines Modal
        vm.openHeadlines = function (e, symbol) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: function ($mdDialog) {
                    var vm = this;
                    vm.symbol = {};
                    vm.symbol = symbol;
                    vm.cancelClick = function () {
                        $mdDialog.cancel();
                    };
                },
                controllerAs: 'modal',
                templateUrl: 'app/air/templates/dialogs/headlines-dialog.tmpl.html',
                parent: angular.element($document.body),
                targetEvent: e
            });
        };

    }
})();
