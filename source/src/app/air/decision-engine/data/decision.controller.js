(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('decisionController', decisionController);

    /* @ngInject */

    function decisionController($http, decisionService, API_CONFIG, $mdDialog, $document, filterFilter) {
        var vm = this;
        vm.ecal = [];
        vm.ecalAfter = [];
        vm.ecalPre = [];
        vm.gainers = [];

        vm.ecalCurPage = 1;
        vm.ecalLimitOptions = [5,10,15];
        vm.ecalPageSize = 5;
        vm.query = {order: 'Symbol'};


        activate();

        function activate() {
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.symbols=[];

            return getListData(API_CONFIG).then(function(data) {
                vm.ecal = data[0].data;
                vm.ecalPre= filterFilter(vm.ecal, { announce: '2' });
                vm.ecalAfter= filterFilter(vm.ecal, { announce: '1' });
                vm.gainers = data[1].data;

                // Get ecal Symbol Data
                if (vm.ecal.length != 0) {
                    // Get Symbols
                    var symbols = data[0].data;
                    angular.forEach(symbols,function(value){
                        var s = value.symbol;
                        var id = value.id;
                        var w = value.announce;
                        var ts = value.timestamp;
                        var av = value.avgVol;
                        vm.list = value.list;
                        vm.updated = new Date(value.timestamp).toLocaleString();
                        getSymbolData(s,id,w,ts,av).then(function(data) {
                            vm.symbols.push(data);
                        });
                    });
                    vm.chartToggle = false;
                    // Build Line Chart
                    vm.lineChartOptions = {
                        chart: {
                            type: 'lineChart',
                            showXAxis: false,
                            showYAxis: false,
                            showLegend: false,
                            interactive: false,
                            duration: 0,
                            height: 90,
                            margin : {top: 0,right: 0,bottom: 0,left: 0},

                            x: function(d){ return d.x; },
                            y: function(d){ return d.y; },
                            callback: function(){
                                window.dispatchEvent(new Event('resize'));
                                vm.chartToggle = true;
                                vm.mainLoader = false;
                            }
                        }
                    };
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        function getListData(API_CONFIG) {
            return decisionService.getListData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return decisionService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,w,ts,av) {
            return decisionService.getSymbolData(s,id,w,ts,av)
                .then(function(data) {
                    var announce;
                    var chart=[{color:'#03a9f4',values:[]}];
                    var quotes = data[0].data.quotes.quote;
                    var chartPrices = data[5].data.data;

                    if ( data[3] == 1 ) { announce = 'After Market'; }
                    if ( data[3] == 2 ) { announce = 'Pre Market'; }
                    if ( data[3] == 3 ) { announce = 'Intraday'; }
                    if ( data[3] == 4 ) { announce = 'Not Specified'; }

                    // Build Chart Object 
                    angular.forEach(chartPrices,function(value){
                        var close = value.close;
                        var date = value.date;
                        var day = moment(date).valueOf();
                        chart[0].values.push({x:day,y:close});
                    });

                    var symbolObject = {
                        'id':parseInt(data[2]),
                        'symbol':data[1],
                        'name':quotes.description,
                        'price':quotes.last,
                        'dollarChange':quotes.change,
                        'percentChange':quotes.change_percentage,
                        'when':announce,
                        'open':quotes.open,
                        'high':quotes.high,
                        'low':quotes.low,
                        'volume':quotes.volume,
                        'avgVol':parseInt(data[6]),
                        'sharesShort':'',
                        'shortPercent':'',
                        'marketCap':'',
                        'float':'',
                        'exchange':quotes.exch,
                        'headlines':'',
                        'chart':chart
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
