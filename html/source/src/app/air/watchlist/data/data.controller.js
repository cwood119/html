(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('watchlistController', watchlistController);

    // Pagination
    angular.module('app.air.earnings-calendar').filter('pagination', function(){
        return function(input, start) {
            if (!input || !input.length) { return; }
            start = +start;
            return input.slice(start);
        };
    });
    /* @ngInject */
    function watchlistController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, watchlistService) {
        var vm = this;

        // Page Variables
        vm.symbols=[];
        vm.layout = 'list';
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};

        // Pagination Variables
        vm.curPage = 1;
        vm.limitOptions = [5,10,25,50];
        vm.pageSize = 5;

        // Price Filter Variables
        vm.priceDisabled = true;
        vm.priceToggle = false;

        // Volume Filter Viarables
        vm.volumeIndicator = 'Any Vol';
        vm.volumeLow = 500000;
        vm.volumeMid = 1000000;
        vm.volumeHigh = 5000000;
        vm.volumeDisabled = true;
        vm.volumeLowDisabled = false;
        vm.volumeMidDisabled = false;
        vm.volumeHighDisabled = false;
        vm.volumeLowToggle = false;
        vm.volumeMidToggle = false;
        vm.volumeHighToggle = false;

        // Avg Vol Filter Viarables
        vm.avgVolIndicator = 'Any Vol';
        vm.avgVolLow = 500000;
        vm.avgVolMid = 1000000;
        vm.avgVolHigh = 5000000;
        vm.avgVolDisabled = true;
        vm.avgVolLowDisabled = false;
        vm.avgVolMidDisabled = false;
        vm.avgVolHighDisabled = false;
        vm.avgVolLowToggle = false;
        vm.avgVolMidToggle = false;
        vm.avgVolHighToggle = false;

        // Float Filter Viarables
        vm.floatIndicator = 'Any Float';
        vm.floatLow = 50000000;
        vm.floatMid = 100000000;
        vm.floatHigh = 500000000;
        vm.floatDisabled = true;
        vm.floatLowDisabled = false;
        vm.floatMidDisabled = false;
        vm.floatHighDisabled = false;
        vm.floatLowToggle = false;
        vm.floatMidToggle = false;
        vm.floatHighToggle = false;

        activate();

        //////////

        function activate() {
            return getwatchlistData().then(function(data) {
                if (data[0].data.length != 0) {
                    vm.symbols = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}
                    vm.list = data[0].data[0].list;
                    vm.updated = new Date(data[0].headers()['last-modified']).toLocaleString();
                }
            });
        }

        function getwatchlistData() {
            return watchlistService.getData()
                .then(function(data) {
                    return data;
                });
        }


        // Price Filter
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
                ceil: 20,
                ticksArray: [0, 5, 10, 15, 20],
                translate: function(value) {return '$' + value;},
                onChange: function () {
                    if (vm.slider.min != 0 || vm.slider.max != 20) {vm.priceToggle=true;vm.priceDisabled=false;}
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
                vm.slider.max = 20;
                vm.priceDisabled=true;
            }
        };


        // Volume Filters
        vm.volume = function()
        {
            if (vm.volumeLowToggle == true || vm.volumeMidToggle == true || vm.volumeHighToggle == true ) {
                vm.volumeDisabled=false;
                vm.volumeToggle=true;
                return function(item){
                    if (vm.volumeLowToggle == true){return item.volume >= vm.volumeLow;}
                    if (vm.volumeMidToggle == true){return item.volume >= vm.volumeMid;}
                    if (vm.volumeHighToggle == true){return item.volume >= vm.volumeHigh;}
                };
            }
            else {vm.volumeDisabled=true;vm.volumeToggle=false;}
        };
        // On-Change
        vm.volumeFilter = function() {
            if (vm.volumeLowToggle == true){vm.volumeMidToggle = true;  vm.volumeHighToggle = true; vm.volumeIndicator = '500K';}
            if (vm.volumeMidToggle == true && vm.volumeLowToggle == false){vm.volumeHighToggle = true; vm.volumeIndicator = '1M';}
            if (vm.volumeHighToggle == true && vm.volumeMidToggle == false){ vm.volumeIndicator = '5M';}
            if (vm.volume != 0){ return true;}
        };
        // Master Volume Toggle
        vm.volumeFilterCheck = function (state) {
            if (state == false) {
                vm.volumeLowToggle=false;
                vm.volumeMidToggle=false;
                vm.volumeHighToggle=false;
                vm.volumeDisabled=true;
                vm.volumeIndicator='Any Vol';
            }
        };

        // avgVol Filters
        vm.avgVol = function()
        {
            if (vm.avgVolLowToggle == true || vm.avgVolMidToggle == true || vm.avgVolHighToggle == true ) {
                vm.avgVolDisabled=false;
                vm.avgVolToggle=true;
                return function(item){
                    if (vm.avgVolLowToggle == true){return item.avgVol >= vm.avgVolLow;}
                    if (vm.avgVolMidToggle == true){return item.avgVol >= vm.avgVolMid;}
                    if (vm.avgVolHighToggle == true){return item.avgVol >= vm.avgVolHigh;}
                };
            }
            else {vm.avgVolDisabled=true;vm.avgVolToggle=false;}
        };
        // On-Change
        vm.avgVolFilter = function() {
            if (vm.avgVolLowToggle == true){vm.avgVolMidToggle = true;  vm.avgVolHighToggle = true; vm.avgVolIndicator = '500K';}
            if (vm.avgVolMidToggle == true && vm.avgVolLowToggle == false){vm.avgVolHighToggle = true; vm.avgVolIndicator = '1M';}
            if (vm.avgVolHighToggle == true && vm.avgVolMidToggle == false){ vm.avgVolIndicator = '5M';}
            if (vm.avgVol != 0){ return true;}
        };
        // Master avgVol Toggle
        vm.avgVolFilterCheck = function (state) {
            if (state == false) {
                vm.avgVolLowToggle=false;
                vm.avgVolMidToggle=false;
                vm.avgVolHighToggle=false;
                vm.avgVolDisabled=true;
                vm.avgVolIndicator='Any Vol';
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
                    vm.cancelClick = function () {
                        $mdDialog.cancel();
                    };
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
                    vm.cancelClick = function () {
                        $mdDialog.cancel();
                    };
                },
                controllerAs: 'modal',
                templateUrl: 'app/air/templates/dialogs/headlines-dialog.tmpl.html',
                parent: angular.element($document.body),
                targetEvent: e
            });
        };



        // Filter Data
        vm.filterPrice = ['5','10','15'];
        vm.filterVolume = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterAdv = [{'value':'500000','text':'500k'},{'value':'1000000','text':'1M'},{'value':'5000000','text':'5M'}];
        vm.filterMktOver = [{'value':'50000000','text':'50M'},{'value':'300000000','text':'300M'},{'value':'2000000000','text':'2B'},{'value':'10000000000','text':'10B'}];
        vm.filterMktUnder = [{'value':'300000000','text':'300M'},{'value':'2000000000','text':'2B'},{'value':'10000000000','text':'10B'},{'value':'200000000000','text':'200B'}];
        vm.filterFloat = [{'value':'50000000','text':'50M'},{'value':'100000000','text':'100M'},{'value':'500000000','text':'500M'}];
        vm.filterShort = [{'value':'5','text':'5%'},{'value':'15','text':'15%'},{'value':'25','text':'25%'}];
        vm.filterTime = [{'value':'2','text':'Before Market'},{'value':'1','text':'After Market'},{'value':'3','text':'Intraday'},{'value':'4','text':'Unknown'}];

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
        // Get current path.  Using this to show/hide before/after market announcement filter
        vm.currentPath = $location.path();
    }
})();
