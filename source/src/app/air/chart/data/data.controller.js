(function() {
    'use strict';
    angular
        .module('app.air.chart')
        .controller('chartController', chartController);

    /* @ngInject */
    function chartController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, chartService, API_CONFIG, $sce) {
        var vm = this;

        // Page Variables
        vm.activate = function(){activate();};
        vm.currentPath = $location.path();
        vm.layout = 'list';
        vm.list = 'alerts';
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};
        vm.toggleSearch = function() {vm.showSearch = !vm.showSearch;};

        // Pagination Variables
        vm.curPage = 1;
        vm.limitOptions = [5,10,25,50];

        vm.query = {order: '-percentChange'};

        // Price Filter Variables
        vm.priceDisabled = true;
        vm.priceToggle = false;

        // Volume Filter Viarables
        vm.volume = 0;
        vm.volumeIndicator = 'Any';
        vm.volumeDisabled = true;

        // Avg Vol Filter Viarables
        vm.avgVol = 0;
        vm.avgVolIndicator = 'Any';
        vm.avgVolDisabled = true;

        //Filter Data
        vm.filterAdv = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterVolume = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        

        activate();

        //////////

        function activate() {

            // Page Variables
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.refreshToggle = 0;

            // Pagination Page Size
            var list = vm.list;
            if (list == 'alerts') { vm.pageSize = 5; }
            else { vm.pageSize = 7;  }

            // Table Columns 
            vm.showPrice = true;
            vm.showDollarChange = true;
            vm.showPercentChange = true;
            vm.showVolume = true;
            vm.showAvgVol = false;
            vm.showDistance = false;
            vm.showAdded = false;
            vm.showWhen = false;
            vm.showHeadlines = true;
        
            // Table Column Headers
            vm.cols = [
                {'name':'Symbol','order':'symbol','show':'true'},
                {'name':'Price','order':'price','show':'vm.showPrice'},
                {'name':'Change','order':'dollarChange','show':'vm.showDollarChange'},
                {'name':'% Change','order':'percentChange','show':'vm.showPercentChange'},
                {'name':'Volume','order':'volume','show':'vm.showVolume'},
                {'name':'Avg Vol','order':'avgVol','show':'vm.showAvgVol'},
                {'name':'Distance','order':'distance','show':'vm.showDistance'},
                {'name':'Added','order':'added','show':'vm.showAdded'},
                {'name':'When','order':'announceDay','show':'vm.showWhen'},
                {'name':'Headlines','order':'','show':'vm.showHeadlines'}
            ];

            vm.columnClick = function(index,checked) {
                if (index == 1){vm.showPrice=checked;}
                if (index == 2){vm.showDollarChange=checked;}
                if (index == 3){vm.showPercentChange=checked;}
                if (index == 4){vm.showVolume=checked;}
                if (index == 5){vm.showAvgVol=checked;}
                if (index == 6){vm.showDistance=checked;}
                if (index == 7){vm.showAdded=checked;}
                if (index == 8){vm.showWhen=checked;}
                if (index == 9){vm.showHeadlines=checked;}
            };

            // Table Columns Show/Hide Menu
            if (vm.list == 'ecal' || vm.list == 'ecalUpdate' || vm.list == 'ecalTracker') {
                vm.columnsMenu = [
                    {'index':1,'name':'Price','checked':vm.showPrice,'disabled':'false','label':'Show/Hide Price Column'},
                    {'index':2,'name':'Change','checked':vm.showDollarChange,'disabled':'false','label':'Show/Hide Dollar Change Column'},
                    {'index':3,'name':'% Change','checked':vm.showPercentChange,'disabled':'false','label':'Show/Hide Percent Change Column'},
                    {'index':4,'name':'Volume','checked':vm.showVolume,'disabled':'false','label':'Show/Hide Volume Column'},
                    {'index':5,'name':'Avg Vol','checked':vm.showAvgVol,'disabled':'false','label':'Show/Hide Average Volume Column'},
                    {'index':6,'name':'Distance','checked':vm.showDistance,'disabled':'true','label':'Show/Hide Distance Column'},
                    {'index':7,'name':'Added','checked':vm.showAdded,'disabled':'true','label':'Show/Hide Added Column'},
                    {'index':8,'name':'When','checked':vm.showWhen,'disabled':'false','label':'Show/Hide When Column'},
                    {'index':9,'name':'Headlines','checked':vm.showHeadlines,'disabled':'false','label':'Show/Hide Headlines Column'}
                ];
            }

            if (vm.list == 'alerts') {
                vm.columnsMenu = [
                    {'index':1,'name':'Price','checked':vm.showPrice,'disabled':'false','label':'Show/Hide Price Column'},
                    {'index':2,'name':'Change','checked':vm.showDollarChange,'disabled':'false','label':'Show/Hide Dollar Change Column'},
                    {'index':3,'name':'% Change','checked':vm.showPercentChange,'disabled':'false','label':'Show/Hide Percent Change Column'},
                    {'index':4,'name':'Volume','checked':vm.showVolume,'disabled':'false','label':'Show/Hide Volume Column'},
                    {'index':5,'name':'Avg Vol','checked':vm.showAvgVol,'disabled':'false','label':'Show/Hide Average Volume Column'},
                    {'index':6,'name':'Distance','checked':vm.showDistance,'disabled':'false','label':'Show/Hide Distance Column'},
                    {'index':7,'name':'Added','checked':vm.showAdded,'disabled':'false','label':'Show/Hide Added Column'},
                    {'index':8,'name':'When','checked':vm.showWhen,'disabled':'false','label':'Show/Hide When Column'},
                    {'index':9,'name':'Headlines','checked':vm.showHeadlines,'disabled':'false','label':'Show/Hide Headlines Column'}
                ];
            }

            if (vm.list == 'watchlist') {
                vm.columnsMenu = [
                    {'index':1,'name':'Price','checked':vm.showPrice,'disabled':'false','label':'Show/Hide Price Column'},
                    {'index':2,'name':'Change','checked':vm.showDollarChange,'disabled':'false','label':'Show/Hide Dollar Change Column'},
                    {'index':3,'name':'% Change','checked':vm.showPercentChange,'disabled':'false','label':'Show/Hide Percent Change Column'},
                    {'index':4,'name':'Volume','checked':vm.showVolume,'disabled':'false','label':'Show/Hide Volume Column'},
                    {'index':5,'name':'Avg Vol','checked':vm.showAvgVol,'disabled':'false','label':'Show/Hide Average Volume Column'},
                    {'index':6,'name':'Distance','checked':vm.showDistance,'disabled':'true','label':'Show/Hide Distance Column'},
                    {'index':7,'name':'Added','checked':vm.showAdded,'disabled':'false','label':'Show/Hide Added Column'},
                    {'index':8,'name':'When','checked':vm.showWhen,'disabled':'false','label':'Show/Hide When Column'},
                    {'index':9,'name':'Headlines','checked':vm.showHeadlines,'disabled':'false','label':'Show/Hide Headlines Column'}
                ];
            }

            // Build Symbol List
            vm.symbols=[];
            return getSymbolsList(API_CONFIG, list).then(function(data) {
                if (data[0].data.length != 0) {

                    if (data[0].data.length < vm.pageSize) { vm.showPagination = false; }
                    else { vm.showPagination = true; }
                    
                    // Get Symbols
                    var symbols = data[0].data;
                    angular.forEach(symbols,function(value){
                        var s = value.symbol;
                        var id = value.id;
                        var ad = value.added;
                        var ts = value.timestamp;
                        var av = value.avgVol;
                        //var index = symbols.indexOf(value)+1;

                        if (list == 'alerts') {
                            var tp = value.alert;
                        }
                        //vm.list = value.list;
                        vm.updated = new Date(value.timestamp).toLocaleString();
                        getSymbolData(s,id,ad,ts,av,API_CONFIG,tp).then(function(data) {
                            vm.symbols.push(data);
                            vm.symbols.sort(function(a, b){ return b.percentChange-a.percentChange; });
                            vm.symbolOne = vm.symbols[0];
                            var index = vm.symbols.length;
                            if ( index == symbols.length) {
                                var symbolOne = vm.symbolOne;
                                vm.lookup(symbolOne);
                                vm.mainLoader = false;
                            }
                        });
                    });
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        // Get Data from Service
        function getSymbolsList(API_CONFIG, list) {
            return chartService.getData(API_CONFIG,list)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return chartService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,ad,ts,av,API_CONFIG,tp) {
            return chartService.getSymbolData(s,id,ad,ts,av,API_CONFIG,tp)
                .then(function(data) {
                    var announce;
                    var quotes = data[0].data.quotes.quote;
                    var symbol = data[1];
                    var when = data[6].data[0];
                    var triggerPrice = data[7];
                    var announceDay = moment(when.date).format('MM/DD/YY');

                    var chartUrl = 'https://www.tradingview.com/widgetembed/?symbol=' + symbol + '&interval=D&hidesidetoolbar=1&symboledit=1&toolbarbg=f1f3f6&studies=&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&referral_id=5952';

                    var list = vm.list;
                    var price = quotes.last;

                    if (list == 'alerts') {
                        var distance = triggerPrice-price;
                    }

                    if ( when.announce == 1 ) { announce = 'After Market'; }
                    if ( when.announce == 2 ) { announce = 'Pre Market'; }
                    if ( when.announce == 3 ) { announce = 'Intraday'; }
                    if ( when.announce == 4 ) { announce = 'Unknown'; }

                    var symbolObject = {
                        'id':parseInt(data[2]),
                        'symbol':symbol,
                        'added':data[5],
                        'name':quotes.description,
                        'price':price,
                        'open':quotes.open,
                        'high':quotes.high,
                        'low':quotes.low,
                        'dollarChange':quotes.change,
                        'percentChange':quotes.change_percentage,
                        'when':announce,
                        'announceDay':announceDay,
                        'volume':quotes.volume,
                        'avgVol':parseInt(data[4]),
                        'exchange':quotes.exch,
                        'headlines':'',
                        'distance':distance,
                        'triggerPrice':triggerPrice,
                        'chartUrl':chartUrl

                    };
                    return symbolObject;
                });
        }

        // Check for New Data
        var updateCheck =  function() {
            vm.refreshToggle = 1;
        };

        // Check for New Data Every 60 Seconds
        $interval(updateCheck, 300000);

        // Price Filter and Controls
        vm.filterFn = function()
        {
            return function(item){
                return item['price'] >= vm.slider.min && item['price'] <= vm.slider.max;
            };
        };

        // Slider
        vm.slider = {
            min: 0,
            max: 50,
            options: {
                floor: 0,
                ceil: 50,
                ticksArray: [0, 5, 10, 15, 20, 30, 40, 50],
                translate: function(value) {return '$' + value;},
                onChange: function () {
                    if (vm.slider.min != 0 || vm.slider.max != 50) {vm.priceToggle=true;vm.priceDisabled=false;}
                    else {vm.priceToggle=false;vm.priceDisabled=true;}
                }
            }
        };

        // Slider starts out hidden, this rebuilds it when the button is clicked
        vm.refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        // Master Price Toggle
        vm.priceFilterCheck = function (state) {
            if (state == false) {
                vm.slider.min = 0;
                vm.slider.max = 50;
                vm.priceDisabled=true;
            }
        };

        // Volume Filter
        vm.volumeFilter = function()
        {
            if (vm.volume < 0) {return function(item){ return item['volume'] <= vm.volume * -1; };}
            else {return function(item){ return item['volume'] >= vm.volume; };}
        };

        // On Volume Radio Change
        vm.volumeChange = function() {
            vm.volumeToggle=true;
            vm.volumeDisabled=false;
            if (vm.volume < 0) {vm.volumeIndicator = vm.volume * -1;}
            else {vm.volumeIndicator = vm.volume;}

        };

        // On Volume Toggle Change
        vm.volumeFilterCheck = function (state) {
            if (state == false) {
                vm.volume=0;
                vm.volumeRadio=false;
                vm.volumeDisabled=true;
                vm.volumeIndicator='Any';
            }
        };

        // Average Volume Filter
        vm.avgVolFilter = function()
        {
            if (vm.avgVol < 0) {return function(item){ return item['avgVol'] <= vm.avgVol * -1; };}
            else {return function(item){ return item['avgVol'] >= vm.avgVol; };}
        };

        // On Average Volume Radio Change
        vm.avgVolChange = function() {
            vm.avgVolToggle=true;
            vm.avgVolDisabled=false;
            if (vm.avgVol < 0) {vm.avgVolIndicator = vm.avgVol * -1;}
            else {vm.avgVolIndicator = vm.avgVol;}

        };

        // On Average Volume Toggle Change
        vm.avgVolFilterCheck = function (state) {
            if (state == false) {
                vm.avgVol=0;
                vm.avgVolRadio=false;
                vm.avgVolDisabled=true;
                vm.avgVolIndicator='Any';
            }
        };

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

        vm.lookup = function submit(sy) {
            vm.s = sy.symbol;
            if (vm.s != '') {
                var chartUrl = 'https://www.tradingview.com/widgetembed/?symbol=' + vm.s + '&interval=D&hidesidetoolbar=1&symboledit=1&toolbarbg=f1f3f6&studies=&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en';
                vm.secUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' + vm.symbol + '&type=&dateb=&owner=exclude&count=100&output=xml';
                vm.googleUrl = 'https://www.google.com/finance?q=' + vm.symbol + '&fstype=ii';
                vm.yahooUrl = 'http://finance.yahoo.com/q/ks?s=' + vm.symbol + '+Key+Statistics';
                vm.chart = $sce.trustAsResourceUrl(chartUrl);
                var s = sy.symbol;
                var id = sy.id;
                var ad = sy.added;
                var ts = sy.timestamp;
                var av = sy.avgVol;
                //vm.list = sy.list;
                getSymbolData(s,id,ad,ts,av,API_CONFIG).then(function(data) {
                    vm.lookupSymbol = data;
                });
                vm.toggle = true;
            }
        };
    }
})();
