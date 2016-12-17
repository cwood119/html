(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalIntradayDEController', ecalIntradayDEController);

    /* @ngInject */
    function ecalIntradayDEController($interval, $http, $mdDialog, $document) {
        var vm = this;
        vm.ecalIntraday = [];
        vm.query = {order: 'Symbol'};
        vm.ecalPreLength=null;
        vm.ecalIntradayToggle=1;
        $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime())
        .success(function(data, status, headers) {
            vm.ecalIntraday = data;
            vm.ecalPreLength = data.length;
            vm.ecalIntradayCurPage = 1;
            vm.ecalIntradayLimitOptions = [5,10,15];
            vm.ecalIntradayPageSize = 5;
            vm.modified = headers()['last-modified'];
            vm.newModified = new Date(vm.modified);
            vm.updated = vm.newModified.toLocaleString();
            vm.twoDaysAgo = moment().startOf('day').subtract(2, 'days').toDate();
            if (vm.newModified < vm.today){vm.ecalPreToggle=0;vm.ecalPre=[];}
            if (vm.ecalPreLength == 0) {vm.ecalPreToggle=0;}
        });
        $http.get('app/air/earnings-calendar/data/data.json?ts='+new Date().getTime())
        .then(function(response) {
            vm.data = response.data;
            vm.list = response.data[0].list;
            if (vm.list == 'Calendar Movers') {vm.ecalIntradayToggle=0;}
            if (vm.list == 'Pre Market Movers') {vm.ecalIntradayToggle=0;}
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
