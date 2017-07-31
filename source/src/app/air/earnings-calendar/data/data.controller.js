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
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};
        vm.toggleSearch = function() {vm.showSearch = !vm.showSearch;};

        // Pagination Variables
        vm.curPage = 1;
        vm.limitOptions = [5,10,25,50];
        vm.pageSize = 5;
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

        activate();

        //////////

        function activate() {
            vm.bulkQuotes=[];
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.refreshToggle = 0;
            var resize = function() { window.dispatchEvent(new Event('resize')); };
            vm.symbols=[];

            vm.today = moment().format('YYYY-MM-DD');
            var yesterday = moment().subtract(1,'day');
            vm.yesterday = moment(yesterday).format('YYYY-MM-DD');

            return getEcalData(API_CONFIG).then(function(data) {

                if (data[0].data.length != 0) {

                    var symbols = data[0].data;

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
                            var id = value.id;
                            var index = symbols.indexOf(value)+1;
                            var w = value.announce;
                            var ts = value.date;
                            var av = value.avgVol;
                            //vm.list = value.list;
                            vm.list = 'Calendar Movers';
                            vm.updated = moment(value.date).format('MMM Do YYYY');

                            getSymbolData(s,id,w,ts,av).then(function(data) {
                                vm.symbols.push(data);
                            });

                            if ( index == symbols.length) {
                                console.log(symbols.length);
                                $timeout(function(){
                                    vm.mainLoader = false;
                                    $timeout(resize,1);
                                },3000);
                            }
                        });
                    },1000);
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        // Get Data from Service
        function getEcalData(API_CONFIG) {
            return ecalService.getData(API_CONFIG)
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

        function getSymbolData(s,id,w,ts,av) {
            return ecalService.getSymbolData(s,id,w,ts,av)
                .then(function(data) {
                    var announce;
                    var announceDay;
                    var chart = [{color:'#03a9f4',values:[]}];
                    var q = filterFilter(vm.bulkQuotes[0][0].data.quotes.quote, { symbol: s }, true);
                    var quotes = q[0];
                    var timeSales = data[4].data.series.data;

                    //var dataPoints = data[6].data.data; 
                    //var fundamentals = data[1].data[0].results[1].tables;
                    //var headlines = data[2].data.data;
                    //var marketCap = dataPoints[1].value;

                    //if ( marketCap == "na" ) { marketCap = 0; }
                    //if ( marketCap == "nm" ) { marketCap = 0; }
                    
                    if ( data[2] == 1 ) { announce = 'After Market'; }
                    if ( data[2] == 2 ) { announce = 'Pre Market'; }
                    if ( data[2] == 3 ) { announce = 'Intraday'; }
                    if ( data[2] == 4 ) { announce = 'Unknown'; }

                    if ( ts == vm.today ) { announceDay = 'Today'; }
                    else if ( ts == vm.yesterday ) { announceDay = 'Yesterday'; }
                    else { announceDay = moment(ts).format('dddd'); }
                    
                    // Build Chart Object 
                    angular.forEach(timeSales,function(value){
                        var close = value.close;
                        var time = value.timestamp;
                        chart[0].values.push({x:time,y:close});
                    });
                    var symbolObject = {
                        'id':parseInt(data[1]),
                        'symbol':data[0],
                        'name':quotes.description,
                        'price':quotes.last,
                        'dollarChange':quotes.change,
                        'percentChange':quotes.change_percentage,
                        'when':announce,
                        'announceDay':announceDay,
                        'open':quotes.open,
                        'high':quotes.high,
                        'low':quotes.low,
                        'volume':quotes.volume,
                        'avgVol':parseInt(data[5]),
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

        // Legacy Sort Reset Function
        vm.reset =  function reset() {
            vm.sortPrice = {};
            vm.sortPercentChange = {};
            vm.sortVolume = {};
            vm.sortAvgVol = {};
            vm.sortMktCap = {};
            vm.sortFloat = {};
            vm.sortShort = {};
            vm.sortSymbol = {};
        };
    }
})();
