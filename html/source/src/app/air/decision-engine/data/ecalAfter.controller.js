(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalAfterDEController', ecalAfterDEController);

    /* @ngInject */
    function ecalAfterDEController($http, $mdDialog, $document) {
        var vm = this;
        vm.ecalAfter = [];
        vm.query = {order: 'Symbol'};
        $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime())
        .then(function(ecalAfterResponse) {
            vm.ecalAfter = ecalAfterResponse.data;
            vm.ecalAfterList = ecalAfterResponse.data[0].list;
            vm.ecalAfterCurPage = 1;
            vm.ecalAfterLimitOptions = [5,10,15];
            vm.ecalAfterPageSize = 5;
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            vm.list = response.data[0].list;
            vm.ecalAfterToggle=1; 
            if (vm.list == 'After Market Movers') {vm.ecalAfterToggle=0;}
        });
        $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers){
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
            vm.twoDaysAgo = moment().startOf('day').subtract(2, 'days').toDate();
            if (vm.newModified < vm.twoDaysAgo){vm.ecalAfterToggle=0;vm.ecalAfter=[];}
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
