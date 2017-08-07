(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('announcementsController', announcementsController);

    /* @ngInject */

    function announcementsController($http, announcementsService, API_CONFIG, $mdDialog, $document, filterFilter, $timeout) {
        var vm = this;
        vm.activate = function(){activate();};
        var nextDay;
        vm.today = moment().format('YYYY-MM-DD');
        var todayIndex = moment(vm.today).day(); // Sunday is 0

        vm.ecalCurPage = 1;
        vm.ecalLimitOptions = [5,10,15];
        vm.ecalPageSize = 5;
        vm.query = {order: '-percentChange'};

        activate();

        function activate() {
            vm.bulkQuotes=[];
            vm.emptySet = false;
            vm.mainLoader = true;
            var resize = function() { window.dispatchEvent(new Event('resize')); };
            vm.symbols=[];

            if (todayIndex == 5){ nextDay = moment().add(3,'day');  } 
            else if (todayIndex == 6){ nextDay = moment().add(2,'day');  } 
            else { nextDay = moment().add(1,'day'); }

            vm.nextDay = moment(nextDay).format('dddd, MMM D');

            var yesterday = moment().subtract(1,'day');
            vm.yesterday = moment(yesterday).format('YYYY-MM-DD');
        
            var endpoint = 'ecal';
            if (vm.day == vm.nextDay){ endpoint = 'ecalNext'; }

            return getListData(API_CONFIG,endpoint).then(function(data) {

                if (data[0].data.length != 0) {

                    var symbols = data[0].data;
                    vm.updated = data[0].data[0].date;

                    // Prepare all symbols for bulk quotes
                    var symbolsObject = [];

                    angular.forEach(symbols,function(value){
                        var s = value.symbol;
                        symbolsObject.push(s);
                    });

                    var allSymbols = symbolsObject.toString();

                    getBulkQuotes(allSymbols).then(function(data) {
                        vm.bulkQuotes.push(data);
                    });

                    if (vm.day != vm.nextDay){ vm.latest = moment(vm.updated).format('dddd, MMM D'); }
                    if ( vm.updated == vm.today ) { vm.announceDay = 'Today'; }
                    else if ( vm.updated == vm.yesterday ) { vm.announceDay = 'Yesterday'; }
                    else { vm.announceDay = moment(vm.updated).format('dddd, MMM D'); }

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
                                //window.dispatchEvent(new Event('resize'));
                            }
                        }
                    };

                    // Get Symbols
                    $timeout(function(){
                        angular.forEach(symbols,function(value){
                            var s = value.symbol;
                            var index = symbols.indexOf(value)+1;
                            var id = value.id;
                            var w = value.announce;
                            var ts = value.date;
                            var av = value.avgVol;
                            vm.list = 'Earnings Announcements';

                            getSymbolData(s,id,w,ts,av).then(function(data) {
                                vm.symbols.push(data);
                            });
                            if ( index == symbols.length) {
                                $timeout(function(){
                                    vm.mainLoader = false;
                                    $timeout(resize,1);
                                },500);
                            }
                        });
                    },500);

                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        function getListData(API_CONFIG,endpoint) {
            return announcementsService.getListData(API_CONFIG,endpoint)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return announcementsService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getBulkQuotes(allSymbols) {
            return announcementsService.getBulkQuotes(allSymbols)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,w,ts,av) {
            return announcementsService.getSymbolData(s,id,w,ts,av)
                .then(function(data) {
                    var announce = data[2];
                    var chart=[{color:'#03a9f4',values:[]}];
                    var chartPrices = data[4].data.history.day;
                    var quotes= filterFilter(vm.bulkQuotes[0][0].data.quotes.quote, { symbol: s }, true);

                    // Build Chart Object 
                    angular.forEach(chartPrices,function(value){
                        var close = value.close;
                        var date = value.date;
                        var day = moment(date).valueOf();
                        chart[0].values.push({x:day,y:close});
                    });

                    var symbolObject = {
                        'id':parseInt(data[1]),
                        'symbol':data[0],
                        'name':quotes[0].description,
                        'price':quotes[0].last,
                        'dollarChange':quotes[0].change,
                        'percentChange':quotes[0].change_percentage,
                        'when':announce,
                        'open':quotes[0].open,
                        'high':quotes[0].high,
                        'low':quotes[0].low,
                        'volume':quotes[0].volume,
                        'avgVol':parseInt(data[5]),
                        'sharesShort':'',
                        'shortPercent':'',
                        'marketCap':'',
                        'float':'',
                        'exchange':quotes[0].exch,
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
