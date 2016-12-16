(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalDEController', ecalDEController);

    /* @ngInject */
    function ecalDEController($interval, $http, $mdDialog, $document) {
        var vm = this;
        vm.ecalDaily = [];
        vm.query = {order: 'Symbol'};
        $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
        .then(function(ecalResponse) {
            vm.ecalDaily = ecalResponse.data;
            vm.ecalList = ecalResponse.data[0].list;
            vm.ecalCurPage = 1;
            vm.ecalLimitOptions = [5,10,15];
            vm.ecalPageSize = 5;
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            vm.list = response.data[0].list;
            vm.ecalToggle=1;
            if (vm.list == 'Earnings Calendar') {vm.ecalToggle=0;}
        });
        $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers){
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
        });

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
                templateUrl: 'app/air/earnings-calendar/dialogs/vitals-dialog.tmpl.html',
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
                templateUrl: 'app/air/earnings-calendar/dialogs/headlines-dialog.tmpl.html',
                parent: angular.element($document.body),
                targetEvent: e
            });
        };

    }
})();
