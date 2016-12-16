(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalPreDEController', ecalPreDEController);

    /* @ngInject */
    function ecalPreDEController($http, $mdDialog, $document) {
        var vm = this;
        vm.ecalPre = [];
        vm.query = {order: 'Symbol'};
        $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime())
        .then(function(ecalPreResponse) {
            vm.ecalPre = ecalPreResponse.data;
            vm.ecalPreList = ecalPreResponse.data[0].list;
            vm.ecalPreCurPage = 1;
            vm.ecalPreLimitOptions = [5,10,15];
            vm.ecalPrePageSize = 5;
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            vm.list = response.data[0].list;
            vm.ecalPreToggle=1;
            if (vm.list == 'Pre Market Movers') {vm.ecalPreToggle=0;}
        });
        $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers){
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
            vm.today = moment().startOf('day').toDate();
            if (vm.newModified < vm.today){vm.ecalPreToggle=0;vm.ecalPre=[];}
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
