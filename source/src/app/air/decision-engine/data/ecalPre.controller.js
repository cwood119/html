(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalPreDEController', ecalPreDEController);

    /* @ngInject */
    function ecalPreDEController($http, $mdDialog, $document, ecalPreService) {
        var vm = this;

        // Page Variables
        vm.ecalPre=[];
        vm.ecalPreLength=null;
        vm.ecalPreToggle=1;

        // Pagination Variables
        vm.ecalPreCurPage = 1;
        vm.ecalPreLimitOptions = [5,10,15];
        vm.ecalPrePageSize = 5;
        vm.query = {order: '-percentChange'};

        activate();

        //////////

        function activate() {
            return getEcalPreData().then(function(data) {
                if (data[0].data.length != 0) {

                    // Get Symbol and Check for Empty Data Set
                    vm.ecalPre = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}

                    // Get List
                    vm.list = data[0].data[0].list;

                    // Get Data Time Stamp
                    var metaIndex = data[0].data.length -1;
                    vm.updated = new Date(data[0].data[metaIndex].meta.updated).toLocaleString();
                    vm.modified = moment(vm.updated, 'MM/DD/YYYY');

                    // Hide Stale List
                    vm.today = moment().startOf('day').toDate();
                    if (moment(vm.modified).isBefore(vm.today,'day')){
                        vm.ecalPreToggle=0;
                        vm.ecalPre=[];
                    }

                } else {vm.ecalPreToggle=0;}
                // Hide if Active on Ecal Page
                if (data[1].data.length != 0) {
                    var list = data[1].data[0].list;
                    if (list == 'Pre Market Movers') {vm.ecalPreToggle=0;}
                }
            });
        }

        // Get Data from Service
        function getEcalPreData() {
            return ecalPreService.getData()
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
