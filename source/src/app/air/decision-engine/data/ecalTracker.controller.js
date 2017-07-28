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
                        var s = value.symbol;
                        var id = value.id;
                        var index = symbols.indexOf(value)+1;
                        var w = value.announce;
                        var ts = value.date;
                        var av = value.avgVol;
                        vm.list = 'Earnings Tracker';
                        getSymbolData(s,id,w,ts,av).then(function(data) {
                            vm.symbols.push(data);
                        });
                        if ( index == vm.ecal.length) {$timeout(function(){vm.mainLoader = false;},3000)}
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

        function getSymbolData(s,id,w,ts,av) {
            return ecalTrackerService.getSymbolData(s,id,w,ts,av)
                .then(function(data) {
                    var announce;
                    //var quotes = data[0].data.quotes.quote;

                    if ( data[3] == 1 ) { announce = 'After Market'; }
                    if ( data[3] == 2 ) { announce = 'Pre Market'; }
                    if ( data[3] == 3 ) { announce = 'Intraday'; }
                    if ( data[3] == 4 ) { announce = 'Not Specified'; }
                    var announceDate = moment(data[4]).format('M/DD/YYYY');
                    var symbolObject = {
                        'id':parseInt(data[2]),
                        'symbol':data[1],
                        //'name':quotes.description,
                        //'price':quotes.last,
                        //'percentChange':quotes.change_percentage,
                        'when':announce,
                        'announceDate':announceDate,
                        //'open':quotes.open,
                        //'high':quotes.high,
                        //'low':quotes.low,
                        'avgVol':parseInt(data[5]),
                        'headlines':''
                    };
                    return symbolObject;
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
