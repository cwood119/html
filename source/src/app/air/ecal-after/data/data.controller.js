(function() {
    'use strict';
    angular
        .module('app.air.ecal-after')
        .controller('ecalAfterController', ecalAfterController);

    /* @ngInject */
    function ecalAfterController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, ecalAfterService, API_CONFIG, filterFilter) {
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

        // Filter Data
        vm.filterPrice = ['5','10','15'];
        vm.filterVolume = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterAdv = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterTime = [{'value':'2','text':'Before Market'},{'value':'1','text':'After Market'},{'value':'3','text':'Intraday'},{'value':'4','text':'Unknown'}];

        activate();

        //////////

        function activate() {
            vm.bulkQuotes=[];
            vm.clock=[];
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.refreshToggle = 0;
            vm.resize = function() { window.dispatchEvent(new Event('resize')); };
            vm.symbols=[];

            vm.today = moment().format('YYYY-MM-DD');
            var yesterday = moment().subtract(1,'day');
            vm.yesterday = moment(yesterday).format('YYYY-MM-DD');

            // Define Line Chart
            vm.lineChartOptions = {
                chart: { type: 'lineChart',showXAxis: false,showYAxis: false,showLegend: false,interactive: false,duration: 0,height: 90,margin : {top: 0,right: 0,bottom: 0,left: 0},

                    x: function(d){ return d.x; },
                    y: function(d){ return d.y; },

                    callback: function(){
                        //window.dispatchEvent(new Event('resize'));
                    }
                }
            };

            getClock().then(function(data) {

                vm.state = data[0].data.clock.state;
                //console.log(vm.state);
                if (vm.state == 'closed' || vm.state == 'postmarket') {
                    vm.list = 'After Market Movers';
                    getRealTimeQuotes();
                }
                else {
                    vm.list = 'After Market Snapshot';
                    getSnapshot();
                }

            });
        }

        function getRealTimeQuotes() {

            return getEcalData(API_CONFIG).then(function(data) {
                vm.ecalData = data;
                if (vm.ecalData.length != 0) {

                    var symbols = vm.ecalData[0].data;
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

                    // Get Symbols
                    $timeout(function(){
                        angular.forEach(symbols,function(value){
                            var ap;
                            var av = value.avgVol;
                            var index = symbols.indexOf(value)+1;
                            var id = value.id;
                            var pc;
                            var s = value.symbol;
                            var ts = value.date;
                            var w = value.announce;

                            vm.updated = moment(value.date).format('MMM Do YYYY');
                            getSymbolData(ap,av,index,id,pc,s,ts,w).then(function(data) {
                                vm.symbols.push(data);
                            });
                                        
                            if ( index == symbols.length) {
                                $timeout(function(){
                                    vm.mainLoader = false;
                                    $timeout(vm.resize,1);
                                },3000);
                            }
                        });
                    },1000);
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        function getSnapshot() {
            return getSnapshotData(API_CONFIG).then(function(data) {
                vm.snapshot = data;
                if (vm.snapshot[0].data.length != 0) {
                    // Get Symbols
                    var symbols = vm.snapshot[0].data;
                    $timeout(function(){
                        angular.forEach(symbols,function(value){
                            var ap = value.ap;
                            var av = value.avgVol;
                            var index = symbols.indexOf(value)+1;
                            var id = value.id;
                            var pc = value.price;
                            var s = value.symbol;
                            var ts = value.date;
                            var w = value.announce;

                            vm.updated = moment(value.date).format('MMM Do YYYY');
                            getSymbolData(ap,av,index,id,pc,s,ts,w).then(function(data) {
                                vm.symbols.push(data);
                            });
                                        
                            if ( index == symbols.length) {
                                $timeout(function(){
                                    vm.mainLoader = false;
                                    $timeout(vm.resize,1);
                                },3000);
                            }
                        });
                    },1000);
                } else {vm.mainLoader = false;vm.emptySet = true;}
            });
        }

        // Get Data from Service

        function getBulkQuotes(allSymbols) {
            return ecalAfterService.getBulkQuotes(allSymbols)
                .then(function(data) {
                    return data;
                });
        }

        function getClock() {
            return ecalAfterService.getClock()
                .then(function(data) {
                    return data;
                });
        }

        function getEcalData(API_CONFIG) {
            return ecalAfterService.getData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return ecalAfterService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getSnapshotData(API_CONFIG) {
            return ecalAfterService.getSnapshot(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(ap,av,index,id,pc,s,ts,w) {
            return ecalAfterService.getSymbolData(s,ts)
                .then(function(data) {
                    var announce;
                    var announceDay;
                    var change;
                    var chart=[{color:'#03a9f4',values:[]}];
                    var percentChange;
                    var symbolObject;
                    var timeSales = data[1].data.series.data;

                    if ( w == 1 ) { announce = 'After Market'; }
                    if ( w == 2 ) { announce = 'Pre Market'; }
                    if ( w == 3 ) { announce = 'Intraday'; }
                    if ( w == 4 ) { announce = 'Not Specified'; }

                    if ( ts == vm.today ) { announceDay = 'Today'; }
                    else if ( ts == vm.yesterday ) { announceDay = 'Yesterday'; }
                    else { announceDay = moment(ts).format('dddd'); }

                    // Build Real Time Symbol Object
                    if ( ap == null ) {
                        var q = filterFilter(vm.bulkQuotes[0][0].data.quotes.quote, { symbol: s }, true);
                        var quotes = q[0];

                        // Get After Market Price
                        var price = timeSales[timeSales.length - 1].close;

                        // Calculate Change
                        //var prevClose = quotes.prevclose;
                        var close = quotes.close;
                        change = price - close;
                        percentChange = (change/close)*100;

                        // Build Chart Object 
                        angular.forEach(timeSales,function(value){
                            var close = value.close;
                            var time = value.timestamp;
                            chart[0].values.push({x:time,y:close});
                        });

                        symbolObject = {
                            'id':parseInt(id),
                            'symbol':data[0],
                            'name':quotes.description,
                            'price':price,
                            'dollarChange':change,
                            'percentChange':percentChange,
                            'when':announce,
                            'announceDay':announceDay,
                            'volume':quotes.volume,
                            'avgVol':parseInt(av),
                            'headlines':'',
                            'chart':chart
                        };

                        return symbolObject;
                    }
                    // Build Snapshot Symbol Object
                    else {
                        // Calculate Change
                        change = ap - pc;
                        percentChange = (change/pc)*100;

                        // Build Chart Object 
                        angular.forEach(timeSales,function(value){
                            var close = value.close;
                            var time = value.timestamp;
                            chart[0].values.push({x:time,y:close});
                        });

                        symbolObject = {
                            'id':parseInt(id),
                            'symbol':data[0],
                            'name':'null',
                            'price':ap,
                            'dollarChange':change,
                            'percentChange':percentChange,
                            'when':announce,
                            'announceDay':announceDay,
                            'volume':'',
                            'avgVol':parseInt(av),
                            'headlines':'',
                            'chart':chart
                        };
                        return symbolObject;
                    }
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
    }
})();
