(function() {
    'use strict';
    angular
        .module('app.air.alerts')
        .controller('alertsController', alertsController);

    /* @ngInject */
    function alertsController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, alertsService, API_CONFIG) {
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
        vm.query = {order: 'distance'};

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

        activate();

        //////////

        function activate() {
            vm.emptySet = false;
            vm.mainLoader = true;
            vm.refreshToggle = 0;
            vm.symbols=[];
            return getAlertsData(API_CONFIG).then(function(data) {
                if (data[0].data.length != 0) {
                    // Get Symbols
                    var symbols = data[0].data;
                    angular.forEach(symbols,function(value){
                        var s = value.symbol;
                        var id = value.id;
                        var ad = value.added;
                        var tp = value.alert;
                        var ts = value.timeStamp;
                        var av = value.avgVol;
                        vm.list = value.list;
                        vm.updated = new Date(value.timestamp).toLocaleString();
                        getSymbolData(s,id,ad,tp,ts,av).then(function(data) {
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
                            //useInteractiveGuideline: true,
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

        // Get Data from Service
        function getAlertsData(API_CONFIG) {
            return alertsService.getData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }

        function getHeadlines(symbol) {
            return alertsService.getHeadlines(symbol)
                .then(function(data) {
                    return data;
                });
        }

        function getSymbolData(s,id,ad,tp,ts,av) {
            return alertsService.getSymbolData(s,id,ad,tp,ts,av)
                .then(function(data) {
                    var chart=[{color:'#03a9f4',values:[]}];
                    var quotes = data[0].data.quotes.quote;
                    var timeSales = data[6].data.series.data;
                    var price = quotes.last; 
                    var triggerPrice = data[4];
                    var distance = triggerPrice-price;

                    // Build Chart Object 
                    angular.forEach(timeSales,function(value){
                        var close = value.close;
                        var time = value.timestamp;
                        chart[0].values.push({x:time,y:close});
                    });
                    var symbolObject = {
                        'id':parseInt(data[2]),
                        'symbol':data[1],
                        'name':quotes.description,
                        'price':price,
                        'dollarChange':quotes.change,
                        'percentChange':quotes.change_percentage,
                        'added':data[3],
                        'triggerPrice':triggerPrice,
                        'distance':distance,
                        'open':quotes.open,
                        'high':quotes.high,
                        'low':quotes.low,
                        'volume':quotes.volume,
                        'avgVol':parseInt(data[7]),
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
            max: 20, 
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
