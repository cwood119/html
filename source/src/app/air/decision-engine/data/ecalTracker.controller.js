(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalTrackerController', ecalTrackerController);

    /* @ngInject */

    function ecalTrackerController($http, ecalTrackerService, API_CONFIG, $mdDialog, $document, $timeout) {
        var vm = this;
        vm.ecal = [];

        vm.ecalCurPage = 1;
        vm.ecalLimitOptions = [5,10,15];
        vm.ecalPageSize = 11;
        vm.query = {order: 'Symbol'};

        activate();

        function activate() {
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.symbols=[];

            return getListData(API_CONFIG).then(function(data) {
                vm.ecal = data[0].data;

                // Get ecal Symbol Data
                if (vm.ecal.length != 0) {
                    // Get Symbols
                    var symbols = data[0].data;
                    angular.forEach(symbols,function(value){
                        var when = value.announce;
                        var av = value.avgVol;
                        var id = value.id;
                        var index = symbols.indexOf(value)+1;
                        vm.list = value.list;

                        var symbolObject = {
                            'id':parseInt(id),
                            'symbol':value.symbol,
                            'announceDate':value.date,
                            'avgVol':parseInt(av),
                            'changeClose':parseInt(value.changeClose),
                            'changeOpen':parseInt(value.changeOpen),
                            'close':value.close,
                            'erClose':value.erClose,
                            'headlines':''
                        };

                        vm.symbols.push(symbolObject);

                        if ( index == vm.ecal.length) {$timeout(function(){vm.mainLoader = false;},3000);}
                    });
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        function getListData(API_CONFIG) {
            return ecalTrackerService.getListData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return ecalTrackerService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        // Headlines Modal
        vm.openHeadlines = function (e, symbol) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: function ($mdDialog) {
                    var vm = this;
                    vm.symbol = {};
                    vm.symbol = symbol;
                    symbol.loading=true;
                    vm.cancelClick = function () {
                        $mdDialog.cancel();
                    };
                    getHeadlines(symbol).then(function(data) {
                        symbol.headlines=data[0].data.data;
                        symbol.loading=false;
                    });
                },
                controllerAs: 'modal',
                templateUrl: 'app/air/templates/dialogs/headlines-dialog.tmpl.html',
                parent: angular.element($document.body),
                targetEvent: e
            });
        };
    }
})();
