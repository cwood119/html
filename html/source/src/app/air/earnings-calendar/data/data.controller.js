(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('ecalController', ecalController);

    // Pagination
    angular.module('app.air.earnings-calendar').filter('pagination', function(){
        return function(input, start) {
            if (!input || !input.length) { return; }
            start = +start;
            return input.slice(start);
        };
    });
    /* @ngInject */
    function ecalController($http, $mdDialog, $location, $document, $timeout, $interval, $window, $mdSidenav, $scope, ecalService) {
        var vm = this;
        vm.curPage = 1;
        vm.layout = 'grid';
        vm.limitOptions = [6,12,24];
        vm.pageSize = 12;
        vm.priceDisabled = true;
        vm.priceToggle = false;
        vm.symbols=[];
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();vm.refreshSlider();};

        // slider
        vm.slider = {
            min: 0,
            max: 20,
            options: {
                floor: 0,
                ceil: 20,
                ticksArray: [0, 5, 10, 15, 20],
                translate: function(value) {return '$' + value;},
                onEnd: function () {
                if (vm.slider.min != 0 || vm.slider.max != 20) {vm.priceToggle=true;vm.priceDisabled=false;}
                else {vm.priceToggle=false;vm.priceDisabled=true;}
                }
            }
        };

        activate();

        /////

        function activate() {
            return getEcalData().then(function(data) {
                if (data[0].data.length != 0) {
                    vm.symbols = data[0].data;
                    var symbol = data[0].data[0].symbol;
                    if (symbol == '') {vm.symbols = [];}
                    vm.list = data[0].data[0].list;
                    vm.updated = new Date(data[0].headers()['last-modified']).toLocaleString();
                }
            });
        }

        function getEcalData() {
            return ecalService.getData()
                .then(function(data) {
                    return data;
                });
        }

        // Slider starts out hidden, this rebuilds it when the button is clicked
        vm.refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        };
        vm.priceFilterCheck = function (state) {
            if (state == false) {
              vm.slider.min = 0;
              vm.slider.max = 20;
              vm.priceDisabled=true;
            }
        }

        // Filter
        vm.filterFn = function()
        {
            return function(item){
                return item['price'] >= vm.slider.min && item['price'] <= vm.slider.max;
            };
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
