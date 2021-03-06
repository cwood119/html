(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('ecalController', ecalController);

    /* @ngInject */
    function ecalController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, ecalService, API_CONFIG, filterFilter) {
        var vm = this;

        // Page Variables
        vm.activate = function(){activate();};
        vm.currentPath = $location.path();
        vm.layout = 'list';
        vm.list = 'Calendar Movers';
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};
        vm.toggleSearch = function() {vm.showSearch = !vm.showSearch;};

        // Pagination Variables
        vm.curPage = 1;
        vm.limitOptions = [5,10,25,50];
        vm.pageSize = 10;
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

        // Percent Change Filter Viarables
        vm.percentChangeFilterValue = -100;
        vm.percentChangeIndicator = 'Any';
        vm.percentChangeDisabled = true;

        // Table Rows
        vm.showPrice = true;
        vm.showDollarChange = true;
        vm.showPercentChange = true;
        vm.showVolume = true;
        vm.showAvgVol = false;
        vm.showDistance = false;
        vm.showAdded = false;
        vm.showWhen = true;
        vm.showHeadlines = true;

        // Table Columns
        vm.cols = [
            {'name':'Symbol','order':'symbol','show':'true'},
            {'name':'Today 5m','order':'','show':'true'},
            {'name':'Price','order':'price','show':'vm.showPrice'},
            {'name':'Change','order':'dollarChange','show':'vm.showDollarChange'},
            {'name':'% Change','order':'percentChange','show':'vm.showPercentChange'},
            {'name':'Volume','order':'volume','show':'vm.showVolume'},
            {'name':'Avg Vol','order':'avgVol','show':'vm.showAvgVol'},
            {'name':'Distance','order':'distance','show':'vm.showDistance'},
            {'name':'Added','order':'added','show':'vm.showAdded'},
            {'name':'When','order':'when','show':'vm.showWhen'},
            {'name':'Headlines','order':'','show':'vm.showHeadlines'}
        ];

        // Table Columns Show/Hide Menu
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

        // Datepicker
        vm.noWeekendsPredicate = function(date) {
            var day = date.getDay();
            return day === 1 || day === 2 || day === 3 || day === 4 || day === 5; 
        };
        vm.snapshotDate = moment().toDate();

        activate();

        //////////

        function activate() {

            vm.bulkQuotes=[];
            vm.historicalQuotes=[];
            vm.symbols=[];

            vm.emptySet = false;
            vm.mainLoader = true;
            vm.refreshToggle = 0;
            var resize = function() { window.dispatchEvent(new Event('resize')); };

            var day = moment(vm.snapshotDate).format('YYYY-MM-DD');
            var weekDay = moment(day).format('dddd');
            var today = moment().format('YYYY-MM-DD');

            vm.listDay = moment(day).format('dddd, MMMM Do YYYY');
            if (day == today) {
                if (weekDay == 'Saturday') { today = moment().subtract(1,'day'); vm.listDay = moment(today).format('dddd, MMMM Do YYYY'); }
                if (weekDay == 'Sunday') { today = moment().subtract(2,'day'); vm.listDay = moment(today).format('dddd, MMMM Do YYYY'); }
            }
            var yesterday = moment().subtract(1,'day');
            vm.yesterday = moment(yesterday).format('YYYY-MM-DD');

            return getEcalData(API_CONFIG, day, today).then(function(data) {

                if (data[0].data.length != 0) {

                    var symbols = data[0].data;

                    if (day == today) { 
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
                    }

                    // Build Line Chart
                    vm.lineChartOptions = {
                        chart: {
                            type: 'lineChart',
                            showXAxis: false,
                            showYAxis: false,
                            showLegend: false,
                            //useInteractiveGuideline: true,
                            interactive: false,
                            duration: 0,
                            height: 60,
                            margin : {top: 0,right: 0,bottom: 0,left: 0},

                            x: function(d){ return d.x; },
                            y: function(d){ return d.y; },
                            callback: function(){
                                window.dispatchEvent(new Event('resize'));
                            }
                        }
                    };

                    // Get Symbols
                    $timeout(function(){
                        angular.forEach(symbols,function(value){
                            var s = value.symbol;
                            var id = value.id;
                            var index = symbols.indexOf(value)+1;
                            var w = value.announce;
                            var ts = value.date;
                            var av = value.avgVol;
                            //vm.list = value.list;
                            vm.updated = moment(value.date).format('MMM Do YYYY');

                            getSymbolData(s,id,w,ts,av,day,today).then(function(data) {
                                vm.symbols.push(data);
                            });

                            if ( index == symbols.length) {
                                $timeout(function(){
                                    vm.mainLoader = false;
                                    $timeout(resize,1);
                                },2000);
                            }
                        });
                    },1000);
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        // Get Data from Service
        function getEcalData(API_CONFIG, day, today) {
            return ecalService.getData(API_CONFIG, day, today)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return ecalService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getVitals(symbol) {
            return ecalService.getVitals(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getBulkQuotes(allSymbols) {
            return ecalService.getBulkQuotes(allSymbols)
                .then(function(data) {
                    return data;
                });
        }

        function getHistoricalQuotes(s,d) {
            return ecalService.getHistoricalQuotes(s,d)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,w,ts,av,d,today) {
            return ecalService.getSymbolData(s,id,w,ts,av,d,today)
                .then(function(data) {
                    var announce;
                    var announceDay;
                    var chart = [{color:'#03a9f4',values:[]}];
                    var history = data[6];
                    var symbol = data[0];
                    var timeSales = data[4].data.series.data;
                    var chartUrl = 'https://www.tradingview.com/widgetembed/?symbol=' + symbol + '&interval=D&hidesidetoolbar=1&symboledit=1&toolbarbg=f1f3f6&studies=&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&referral_id=5952';

                    if ( data[2] == 1 ) { announce = 'After Market'; }
                    if ( data[2] == 2 ) { announce = 'Pre Market'; }
                    if ( data[2] == 3 ) { announce = 'Intraday'; }
                    if ( data[2] == 4 ) { announce = 'Unknown'; }

                    // Build Chart Object 
                    angular.forEach(timeSales,function(value){
                        var close = value.close;
                        var time = value.timestamp;
                        chart[0].values.push({x:time,y:close});
                    });

                    var q;
                    var quotes;
                    var price;
                    var description;
                    var dollarChange;
                    var percentChange;
                    var open;
                    var high;
                    var low;
                    var volume;
                    var exchange;

                    if (d == today) { 
                        q = filterFilter(vm.bulkQuotes[0][0].data.quotes.quote, { symbol: s }, true);
                        quotes = q[0];
                        price = quotes.last;
                        description = quotes.description;
                        dollarChange = quotes.change;
                        percentChange = quotes.change_percentage;
                        open = quotes.open;
                        high = quotes.high;
                        low = quotes.low;
                        volume = quotes.volume;
                        exchange = quotes.exch;
                    }
                    else {
                        vm.historicalQuotes = history;
                        var yQuotes = vm.historicalQuotes.data.data[1];
                        var yClose = yQuotes.close;
                        quotes = vm.historicalQuotes.data.data[0];
                        price = quotes.close;
                        description = '';
                        open = quotes.open;
                        high = quotes.high;
                        low = quotes.low;
                        volume = quotes.volume;
                        exchange = '';
                        dollarChange = price - yClose;
                        percentChange = (dollarChange/yClose)*100;
                        //announceDay = moment(ts).format('MMM Do YYYY');  
                    }

                    vm.today = moment().format('YYYY-MM-DD');
                    if ( ts == vm.today ) { announceDay = 'Today'; }
                    else if ( ts == vm.yesterday ) { announceDay = 'Yesterday'; }
                    else { announceDay = moment(ts).format('dddd'); }

                    var symbolObject = {
                        'id':parseInt(data[1]),
                        'symbol':symbol,
                        'name':description,
                        'price':price,
                        'dollarChange':dollarChange,
                        'percentChange':percentChange,
                        'date':moment(ts).format('dddd, MMMM Do YYYY'),
                        'when':announce,
                        'announceDay':announceDay,
                        'open':open,
                        'high':high,
                        'low':low,
                        'volume':volume,
                        'avgVol':parseInt(data[5]),
                        'sharesShort':'',
                        'shortPercent':'',
                        'marketCap':'',
                        'float':'',
                        'exchange':exchange,
                        'headlines':'',
                        'chart':chart,
                        'chartUrl':chartUrl
                    };
                    return symbolObject;
                });
        }

        // Check for New Data
        var updateCheck =  function() {
            var dow = moment().format('dddd');
            if (dow != 'Saturday' && dow != 'Sunday') { vm.refreshToggle = 1; }
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
            max: 25, 
            options: { 
                floor: 0,
                ceil: 25,
                ticksArray: [0, 5, 10, 15, 20, 25],
                translate: function(value) {return '$' + value;},
                onChange: function () {
                    if (vm.slider.min != 0 || vm.slider.max != 25) {vm.priceToggle=true;vm.priceDisabled=false;}
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
                vm.slider.max = 25;
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

        // Float Filter
        vm.floatFilter = function()
        {
            if (vm.float < 0) {return function(item){ return item['float'] <= vm.float * -1; };}
            else {return function(item){ return item['float'] >= vm.float; };}
        };

        // On Float Radio Change
        vm.floatChange = function() {
            vm.floatToggle=true;
            vm.floatDisabled=false;
            if (vm.float < 0) {vm.floatIndicator = vm.float * -1;}
            else {vm.floatIndicator = vm.float;}

        };

        // On Float Toggle Change
        vm.floatFilterCheck = function (state) {
            if (state == false) {
                vm.float=0;
                vm.floatRadio=false;
                vm.floatDisabled=true;
                vm.floatIndicator='Any';
            }
        };

        // Market Cap Filter
        vm.marketCapFilter = function()
        {
            if (vm.marketCap < 0) {return function(item){ return item['marketCap'] <= vm.marketCap * -1; };}
            else {return function(item){ return item['marketCap'] >= vm.marketCap; };}
        };

        // On Market Cap Radio Change
        vm.marketCapChange = function() {
            vm.marketCapToggle=true;
            vm.marketCapDisabled=false;
            if (vm.marketCap < 0) {vm.marketCapIndicator = vm.marketCap * -1;}
            else {vm.marketCapIndicator = vm.marketCap;}
        };

        // On Market Cap Toggle Change
        vm.marketCapFilterCheck = function (state) {
            if (state == false) {
                vm.marketCap=0;
                vm.marketCapRadio=false;
                vm.marketCapDisabled=true;
                vm.marketCapIndicator='Any';
            }
        };

        // Short Filter
        vm.shortFilter = function()
        {
            if (vm.short < 0) {return function(item){ return item['shortPercent'] <= vm.short * -1; };}
            else {return function(item){ return item['shortPercent'] >= vm.short; };}
        };

        // On Short Radio Change
        vm.shortChange = function() {
            vm.shortToggle=true;
            vm.shortDisabled=false;
            if (vm.short < 0) {vm.shortIndicator = vm.short * -1;}
            else {vm.shortIndicator = vm.short;}

        };

        // On Short Toggle Change
        vm.shortFilterCheck = function (state) {
            if (state == false) {
                vm.short=0;
                vm.shortRadio=false;
                vm.shortDisabled=true;
                vm.shortIndicator='Any';
            }
        };

        // Percent Change Filter
        vm.percentChangeFilter = function()
        {
            if (vm.percentChangeFilterValue < 0) {return function(item){ return item['percentChange'] <= vm.percentChangeFilterValue * -1; };}
            else {return function(item){ return item['percentChange'] >= vm.percentChangeFilterValue; };}
        };

        // On Percent Change Radio Change
        vm.percentChangeChange = function() {
            vm.percentChangeToggle=true;
            vm.percentChangeDisabled=false;
            if (vm.percentChangeFilterValue < 0) {vm.percentChangeIndicator = vm.percentChangeFilterValue * -1;}
            else {vm.percentChangeIndicator = vm.percentChangeFilterValue;}

        };

        // On Percent Change Toggle Change
        vm.percentChangeFilterCheck = function (state) {
            if (state == false) {
                vm.percentChangeFilterValue=-100;
                vm.percentChangeRadio=false;
                vm.percentChangeDisabled=true;
                vm.percentChangeIndicator='Any';
            }
        };

        // Vitals Modal
        vm.openVitals = function (e, symbol) {
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
                    getVitals(symbol).then(function(data) {
                        //var ownershipDetails = data[0].data[0].results[1].tables.ownership_details;
                        //var company_profile = data[0].data[0].results[0].tables.company_profile;
                        //var shareClassProfile = data[0].data[0].results[1].tables.share_class_profile;
                        //var sharesOutstanding = shareClassProfile.shares_outstanding;
                        var ownershipSummary = data[0].data[0].results[1].tables.ownership_summary;
                        symbol.sharesShort = ownershipSummary.short_interest;
                        symbol.shortPercent = ownershipSummary.short_percentage_of_float;

                        /*if (ownershipSummary == null) { symbol.sharesShort=0;symbol.shortPercent=0; }
                        else {
                            //var insiderOwnership = ownershipSummary.insider_shares_owned;
                            //symbol.float = sharesOutstanding-insiderOwnership;
                            symbol.sharesShort = ownershipSummary.short_interest;
                            symbol.shortPercent = ownershipSummary.short_percentage_of_float;
                        }*/

                        symbol.loading=false;
                    });
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

        // Legacy Filter Data
        vm.filterPrice = ['5','10','15'];
        vm.filterVolume = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterAdv = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterMktOver = [{'value':'50000000','text':'50M'},{'value':'300000000','text':'300M'},{'value':'2000000000','text':'2B'},{'value':'10000000000','text':'10B'}];
        vm.filterMktUnder = [{'value':'300000000','text':'300M'},{'value':'2000000000','text':'2B'},{'value':'10000000000','text':'10B'},{'value':'200000000000','text':'200B'}];
        vm.filterFloat = [{'value':'50000000','text':'50M'},{'value':'100000000','text':'100M'},{'value':'500000000','text':'500M'}];
        vm.filterShort = [{'value':'5','text':'5%'},{'value':'15','text':'15%'},{'value':'25','text':'25%'}];
        vm.filterTime = [{'value':'2','text':'Before Market'},{'value':'1','text':'After Market'},{'value':'3','text':'Intraday'},{'value':'4','text':'Unknown'}];
        vm.filterPercentChange = [{'value':'5','text':'5%'},{'value':'10','text':'10%'},{'value':'15','text':'15%'}];

    }
})();
