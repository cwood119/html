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
        vm.ecalPreLength=null;
        vm.ecalPreToggle=1;
        $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers) {
            vm.ecalPre = data;
            vm.ecalPreLength = data.length;
            vm.ecalPreCurPage = 1;
            vm.ecalPreLimitOptions = [5,10,15];
            vm.ecalPrePageSize = 5;
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
            vm.today = moment().startOf('day').toDate();
            if (vm.ecalPreLength == 0) {vm.ecalPreToggle=0;}
            if (vm.newModified < vm.today){vm.ecalPreToggle=0;vm.ecalPre=[];}
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            if (response.data.length != 0) {
                vm.list = response.data[0].list;
                if (vm.list == 'Pre Market Movers') {vm.ecalPreToggle=0;}
            } 
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
