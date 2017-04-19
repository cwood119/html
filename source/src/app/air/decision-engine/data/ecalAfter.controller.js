(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalAfterDEController', ecalAfterDEController);

    /* @ngInject */

    function ecalAfterDEController($http, $mdDialog, $document, ecalAfterService) {
        var vm = this;

        // Page Variables
        vm.ecalAfter=[];
        vm.ecalAfterLength=null;
        vm.ecalAfterToggle=1;

        // Pagination Variables
        vm.ecalAfterCurPage = 1;
        vm.ecalAfterLimitOptions = [5,10,15];
        vm.ecalAfterPageSize = 5;
        vm.query = {order: '-percentChange'};

        activate();

        //////////

        function activate() {
            return getEcalAfterData().then(function(data) {
                if (data[0].data.length != 0) {

                    // Get Symbol and Check for Empty Data Set
                    vm.ecalAfter = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}

                    // Get Data Time Stamp
                    var metaIndex = data[0].data.length -1;
                    vm.updated = new Date(data[0].data[metaIndex].meta.updated).toLocaleString();
                    vm.modified = moment(vm.updated, 'MM/DD/YYYY');

                    // Get List
                    vm.list = data[0].data[metaIndex].meta.list;

                    // Hide Stale List
                    vm.yesterday = moment().startOf('day').subtract(1, 'days').toDate();
                    if (moment(vm.modified).isBefore(vm.yesterday,'day')){
                        vm.ecalAfterToggle=0;
                        vm.ecalAfter=[];
                    }

                } else {vm.ecalAfterToggle=0;}
                // Hide if Active on Ecal Page
                if (data[1].data.length != 0) {
                    var metaIndex2 = data[1].data.length -1;
                    var list = data[1].data[metaIndex2].meta.list;
                    if (list == 'After Market Movers') {vm.ecalAfterToggle=0;}
                }
            });
        }

        // Get Data from Service
        function getEcalAfterData() {
            return ecalAfterService.getData()
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
