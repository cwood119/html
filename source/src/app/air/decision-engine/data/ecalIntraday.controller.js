(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalIntradayDEController', ecalIntradayDEController);

    /* @ngInject */
    function ecalIntradayDEController($interval, $http, $mdDialog, $document, ecalIntradayService) {
        var vm = this;

        // Page Variables
        vm.ecalIntraday=[];
        vm.ecalIntradayLength=null;
        vm.ecalIntradayToggle=1;

        // Pagination Variables
        vm.ecalIntradayCurPage = 1;
        vm.ecalIntradayLimitOptions = [5,10,15];
        vm.ecalIntradayPageSize = 5;
        vm.query = {order: '-percentChange'};

        activate();

        //////////

        function activate() {
            return getEcalIntradayData().then(function(data) {
                if (data[0].data.length != 0) {

                    // Get Symbol and Check for Empty Data Set
                    vm.ecalIntraday = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}

                    // Get List
                    vm.list = data[0].data[0].list;

                    // Get Data Time Stamp
                    vm.updated = new Date(data[0].data[0].updated).toLocaleString();
                    vm.modified = moment(vm.updated, 'MM/DD/YYYY');

                    // Hide Stale List
                    vm.yesterday = moment().startOf('day').subtract(1, 'days').toDate();
                    if (moment(vm.modified).isBefore(vm.yesterday,'day')){
                        vm.ecalIntraday=[];
                        vm.ecalIntradayToggle=0;
                    }
                } else {
                    vm.ecalIntraday = [];
                    vm.ecalIntradayToggle=0;
                }
                // Hide if Active on Ecal Page
                if (data[1].data.length != 0) {
                    var list = data[1].data[0].list;
                    if (list == 'Calendar Movers') {vm.ecalIntradayToggle=0;}
                    if (list == 'Pre Market Movers') {vm.ecalIntradayToggle=0;}
                }
            });
        }

        // Get Data from Service
        function getEcalIntradayData() {
            return ecalIntradayService.getData()
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
