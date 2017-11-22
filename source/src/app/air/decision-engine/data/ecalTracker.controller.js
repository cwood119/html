(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('ecalTrackerController', ecalTrackerController);

    /* @ngInject */

    function ecalTrackerController($http, ecalTrackerService, API_CONFIG, $mdDialog, $document, $mdSidenav, $scope, $timeout) {
        var vm = this;
        vm.ecal = [];
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};

        vm.ecalCurPage = 1;
        vm.ecalLimitOptions = [5,10,15];
        vm.ecalPageSize = 11;
        vm.query = {order: '-change'};

        // Price Filter Variables
        vm.priceDisabled = true;
        vm.priceToggle = false;

        // Avg Vol Filter Viarables
        vm.avgVol = 0;
        vm.avgVolIndicator = 'Any';
        vm.avgVolDisabled = true;

        //Filter Data
        vm.filterAdv = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];

        // Table Rows
        vm.showPrice = true;
        vm.showAvgVol = true;
        vm.showWhen = true;

        // Table Columns Show/Hide Menu
        vm.columnsMenu = [
            {'index':1,'name':'Price','checked':vm.showPrice,'disabled':'false','label':'Show/Hide Price Column'},
            {'index':2,'name':'Avg Vol','checked':vm.showAvgVol,'disabled':'false','label':'Show/Hide Average Volume Column'},
            {'index':3,'name':'When','checked':vm.showWhen,'disabled':'false','label':'Show/Hide When Column'}
        ];

        vm.columnClick = function(index,checked) {
            if (index == 1){vm.showPrice=checked;}
            if (index == 2){vm.showAvgVol=checked;}
            if (index == 3){vm.showWhen=checked;}
        };

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
                        var av = value.avgVol;
                        var id = value.id;
                        var index = symbols.indexOf(value)+1;
                        vm.list = value.list;
                        var erClose = value.erClose;
                        var latestClose = value.latestClose;
                        var change = latestClose - erClose;
                        vm.percentChange = (change / erClose) * 100;
                        //vm.change = parseFloat(vm.percentChange).toFixed(2);
                        vm.change = Number(vm.percentChange);
//console.log(value.symbol + " erClose is "+erClose+" latestClose is "+latestClose+" change is "+change+" percentChange is "+vm.percentChange);
                        var symbolObject = {
                            'id':parseInt(id),
                            'symbol':value.symbol,
                            'price':latestClose,
                            'announceDate':value.date,
                            'avgVol':parseInt(av),
                            'change':vm.change,
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
