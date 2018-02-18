(function() {
    'use strict';
    angular
        .module('app.air.chart')
        .controller('chartController', chartController);

    /* @ngInject */
    function chartController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, chartService, API_CONFIG, $sce, filterFilter) {
        var vm = this;

        // Page Variables
        vm.activate = function(){activate();};
        vm.currentPath = $location.path();
        vm.list = 'ecalTracker';
        //vm.list = 'ecalNext';
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
        

        // Data Placeholders
        vm.lookupSymbol = {
            'symbol': '#AirApp', 
            'name': 'Automated Investment Research', 
            'industry': 'Information Technology',
            'sector': 'FinTech',
            'price': 12.34,
            'todayChange': 0,
            'todayPercentChange': 12.34,
            'open': 12.34,
            'high': 12.34,
            'low': 12.34,
            'shortInterest': 12.34,
            'shortPercent': 12.34,
            'float': 12.34,
            'marketCap': 12.34,
            'headlines': [
                {
                    'publication_date':moment(),
                    'url':'https://twitter.com/hashtag/AirApp?src=hash',
                    'title':'#AirApp Hashtag on Twitter'
                },
                {
                    'publication_date':moment(),
                    'url':'https://twitter.com/hashtag/AirApp?src=hash',
                    'title':'#AirApp Hashtag on Twitter'
                },
                {
                    'publication_date':moment(),
                    'url':'https://twitter.com/hashtag/AirApp?src=hash',
                    'title':'#AirApp Hashtag on Twitter'
                },
                {
                    'publication_date':moment(),
                    'url':'https://twitter.com/hashtag/AirApp?src=hash',
                    'title':'#AirApp Hashtag on Twitter'
                },
                {
                    'publication_date':moment(),
                    'url':'https://twitter.com/hashtag/AirApp?src=hash',
                    'title':'#AirApp Hashtag on Twitter'
                }
            ] 
        };

        activate();

        //////////

        function activate() {

            // Page Variables
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.lookupLoader = true;
            vm.headlinesLoader = true;
            vm.aboutLoader = true;
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
            vm.showWhen = true;
            vm.showHeadlines = false;
        
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
            if (vm.list == 'ecal' || vm.list == 'ecalUpdate' || vm.list == 'ecalTracker' || vm.list == 'ecalNext') {
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
            vm.announceData = []; 
            vm.bulkQuotes = [];
            vm.symbols = [];
            vm.download = [];

            return getSymbolsList(API_CONFIG, list).then(function(data) {
                if (data[0].data.length != 0) {

                    vm.announceData = data[0].data;

                    if (data[0].data.length < vm.pageSize) { vm.showPagination = false; }
                    else { vm.showPagination = true; }
            
                    // Prepare all symbols for bulk quotes
                    var symbols = data[0].data;
                    var symbolsObject = [];
                    angular.forEach(symbols,function(value){
                        var s = value.symbol;
                        symbolsObject.push(s);
                    });

                    var allSymbols = symbolsObject.toString();

                    getBulkQuotes(allSymbols).then(function(data) {
                        vm.bulkQuotes.push(data);

                        // Look Through Symbols 
                        angular.forEach(symbols,function(value){
                            var s = value.symbol;
                            var id = value.id;
                            var ad = value.added;
                            var ts = value.timestamp;
                            var av = value.avgVol;
                            var erClose = value.erClose;
                            var latestClose = value.latestClose;
                            var change = latestClose - erClose;
                            var pChange = (change / erClose) * 100;
                            var percentChange = Number(pChange);
                            vm.download.push(s);

                            if (list == 'alerts') { var tp = value.alert; }
                            if (list == 'ecalNext') { vm.announce = value.announce; vm.announceDay = value.date; }

                            vm.updated = new Date(value.timestamp).toLocaleString();

                            // Build Symbol Objects
                            getSymbolData(s,id,ad,ts,av,API_CONFIG,tp,erClose,latestClose,change,percentChange,list).then(function(data) {
                                vm.symbols.push(data);
                                vm.symbols.sort(function(a, b){ return b.percentChange-a.percentChange; });

                                // Get First Symbol in List to run Lookup Function on
                                vm.symbolOne = vm.symbols[0];
                                var index = vm.symbols.length;
                                if ( index == symbols.length) {
                                    var symbolOne = vm.symbolOne;
                                    vm.lookup(symbolOne);
                                    vm.mainLoader = false;
                                }
                            });
                        });
                    });


                    vm.downloadSymbols = function() {

                        var content = '';

                        for (var i = 0; i < vm.download.length; i += 1) {
                            content += vm.download[i] ;
                            content += '\n';
                        }

                        var uri = 'data:application/octet-stream,' + encodeURIComponent(content);
                        $window.open(uri);
                    };

                } else {vm.mainLoader = false;vm.lookupLoader = false;vm.headlinesLoader = false;vm.aboutLoader = false;vm.emptySet = true;}
            });
        }

        // Get Data from Service
        function getSymbolsList(API_CONFIG, list) {
            return chartService.getData(API_CONFIG,list)
                .then(function(data) {
                    return data;
                });
        }

        function getBulkQuotes(allSymbols) {
            return chartService.getBulkQuotes(allSymbols)
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

        function getLookupData(symbol,API_CONFIG) {
            return chartService.getLookupData(symbol,API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,ad,ts,av,API_CONFIG,tp,erClose,latestClose,change,percentChange,list) {
            return chartService.getSymbolData(s,id,ad,ts,av,API_CONFIG,tp,erClose,latestClose,change,percentChange,list)
                .then(function(data) {

                    // Data
                    //var quotes = data[0].data.quotes.quote;
                    var symbol = data[0];
                    var id = parseInt(data[1]);
                    var avgVol = parseInt(data[3]);
                    var added = data[4];
                    var list = vm.list;
                    var quotes= filterFilter(vm.bulkQuotes[0][0].data.quotes.quote, { symbol: symbol }, true);
                    if (list != 'ecalNext') { vm.announce = data[5].data[0].announce; vm.announceDay = data[5].data[0].date; }
                    var triggerPrice = data[6];

                    // Quotes
                    var name = quotes[0].description;
                    var price = quotes[0].last;
                    var open = quotes[0].open;
                    var high = quotes[0].high;
                    var low = quotes[0].low;
                    vm.percentChange = quotes[0].change_percentage;
                    if (list == 'ecalTracker') { vm.change = data[9]; vm.percentChange = data[10]; }
                    else { vm.change = quotes[0].change; }
                    var todayPercentChange = quotes[0].change_percentage;
                    var todayChange = quotes[0].change;
                    var volume = quotes[0].volume;
                    var exchange = quotes[0].exch;

                    // Custom
                    var aDay = vm.announceDay;
                    var announce = vm.announce;
                    var distance;
                    var changeHeader;
                    var percentChangeHeader;
                    var announceDay = moment(aDay).format('MM/DD/YY');

                    var chartUrl = 'https://www.tradingview.com/widgetembed/?symbol=' + symbol + '&interval=D&hidesidetoolbar=1&symboledit=1&toolbarbg=f1f3f6&studies=&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&referral_id=5952';


                    if (list == 'alerts') { distance = triggerPrice-price; }
                    else { distance = '-'; }

                    if ( announce == 1 ) { announce = 'After Market'; }
                    if ( announce == 2 ) { announce = 'Pre Market'; }
                    if ( announce == 3 ) { announce = 'Intraday'; }
                    if ( announce == 4 ) { announce = 'Unknown'; }

                    var symbolObject = {
                        'id':id,
                        'symbol':symbol,
                        'added':added,
                        'name':name,
                        'price':price,
                        'open':open,
                        'high':high,
                        'low':low,
                        'dollarChange':vm.change,
                        'percentChange':vm.percentChange,
                        'changeHeader':changeHeader,
                        'percentChangeHeader':percentChangeHeader,
                        'todayPercentChange':todayPercentChange,
                        'todayChange':todayChange,
                        'when':announce,
                        'announceDay':announceDay,
                        'volume':volume,
                        'avgVol':avgVol,
                        'exchange':exchange,
                        'distance':distance,
                        'triggerPrice':triggerPrice,
                        'chartUrl':chartUrl
                    };
                    return symbolObject;
                });
        }

        vm.lookup = function submit(sy) {
            vm.lookupLoader = true;
            vm.headlinesLoader = true;
            vm.aboutLoader = true;
            vm.s = sy.symbol;

            if (vm.s != '') {
                var chartUrl = 'https://www.tradingview.com/widgetembed/?symbol=' + vm.s + '&interval=D&hidesidetoolbar=1&symboledit=1&toolbarbg=f1f3f6&studies=&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en';
                vm.chart = $sce.trustAsResourceUrl(chartUrl);
                var symbol = sy.symbol;
                var id = sy.id;

                getLookupData(symbol,API_CONFIG).then(function(data) {
                    var company = data[1].data;
                    var stats = data[2].data;
                    var headlines = data[3].data.data;

                    // Quotes
                    var price = sy.price;
                    var open = sy.open;
                    var high = sy.high; 
                    var low = sy.low; 
                    var todayChange = sy.dollarChange; 
                    var todayPercentChange = sy.percentChange; 

                    // Previous 
                    var previous = data[4].data;
                    var prevHigh = previous.high;
                    var prevLow = previous.low;

                    // Price Range
                    var avgRange = ((high-low)+(prevHigh-prevLow))/2;

                    // Percent Change
                    var percentChangeHeader;
                    var changeHeader;

                    if ( todayChange < 0) { percentChangeHeader =  todayPercentChange * -1; changeHeader =  todayChange * -1; }
                    else { percentChangeHeader = todayPercentChange; changeHeader = todayChange;  }

                    // Stats
                    var shortInterest = stats.shortInterest;
                    var shortDate = stats.shortDate;
                    var float = stats.float;
                    var marketCap = stats.marketcap;

                    // Float
                    var shortPercent;
                    if (float == '' || float == 0 || float == null) { shortPercent = ''; }
                    else { shortPercent = 100 *(shortInterest/float); }

                    // When
                    var announceDay = sy.announceDay;
                    var announce = sy.when;

                    // External Links
                    var twitterUrl = 'https://twitter.com/search?f=tweets&vertical=default&q=%24' + symbol;
                    var googleUrl = 'https://www.google.com/finance?q=' + symbol; 
                    var yahooUrl = 'http://finance.yahoo.com/quote/' + symbol + '?p=' + symbol;
                    var ratingsUrl = 'https://www.benzinga.com/stock/' + symbol + '/ratings/';

                    var secUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' + symbol + '&type=&dateb=&owner=exclude&count=100&output=xml';
                    var statementsUrl = 'https://finance.google.com/finance?q=' + symbol + '&fstype=ii';
                    var transcriptsUrl = 'https://seekingalpha.com/symbol/' + symbol + '/earnings/transcripts';

                    vm.lookupSymbol = {
                        'id':id,
                        'symbol':symbol,
                        'name':sy.name,
                        'price':price,
                        'open':open,
                        'high':high,
                        'low':low,
                        'todayChange':todayChange,
                        'changeHeader':changeHeader,
                        'percentChangeHeader':percentChangeHeader,
                        'marketCap':marketCap,
                        'shortInterest':shortInterest,
                        'shortPercent':shortPercent,
                        'shortDate':shortDate,
                        'float':float,
                        'industry':company.industry,
                        'longDescription':company.description,
                        'sector':company.sector,
                        'twitterUrl':twitterUrl,
                        'googleUrl':googleUrl,
                        'yahooUrl':yahooUrl,
                        'ratingsUrl':ratingsUrl,
                        'secUrl':secUrl,
                        'statementsUrl':statementsUrl,
                        'transcriptsUrl':transcriptsUrl,
                        'prevHigh':prevHigh,
                        'prevLow':prevLow,
                        'headlines':headlines,
                        'chartUrl':chartUrl,
                        'avgRange':avgRange,
                        'when':announce,
                        'announceDay':announceDay
                    };

                    $timeout(function(){
                        jQuery(document).ready(function($) {

                            // Content Slider
                            vm.slickConfig = {
                                method: {},
                                infinite: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                responsive: [
                                    {
                                        breakpoint: 1245,
                                        settings: {
                                            slidesToShow: 2,
                                            slidesToScroll: 2
                                        }
                                    },
                                    {
                                        breakpoint: 860,
                                        settings: {
                                            slidesToShow: 1,
                                            slidesToScroll:1 
                                        }
                                    }
                                ]
                            };
                            $(window).trigger('resize');
                            vm.lookupLoader = false;
                            vm.headlinesLoader = false;
                            vm.aboutLoader = false;
                        });
                    },1000);
                });
                vm.toggle = true;
            }
        };

        // Check for New Data
        //var updateCheck =  function() {
        //    vm.refreshToggle = 1;
        //};

        // Check for New Data Every 60 Seconds
        //$interval(updateCheck, 1);

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
    }
})();
