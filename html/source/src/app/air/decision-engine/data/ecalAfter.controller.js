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
        vm.ecalAfterLength=null;
        vm.ecalAfterToggle=1;
        $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers){
            vm.ecalAfter = data;
            vm.ecalAfterLength = data.length;
            vm.ecalAfterCurPage = 1;
            vm.ecalAfterLimitOptions = [5,10,15];
            vm.ecalAfterPageSize = 5;
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
            vm.yesterday = moment().startOf('day').subtract(1, 'days').toDate();
            vm.thisDay = moment().weekday();
            if (vm.ecalAfterLength == 0) {vm.ecalAfterToggle=0;}
            if (vm.newModified < vm.yesterday){vm.ecalAfterToggle=0;vm.ecalAfter=[];}
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            vm.list = response.data[0].list;
            if (vm.list == 'After Market Movers') {vm.ecalAfterToggle=0;}
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
