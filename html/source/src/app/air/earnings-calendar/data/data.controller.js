(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('dataController', dataController);

    /* @ngInject */
    function dataController($http, $mdDialog, $location) {
        var vm = this;
        // Get data
        $http.get("app/air/earnings-calendar/data/data.json")
          .then(function(response) {
           vm.symbols = response.data;
          });

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
               templateUrl: 'app/air/earnings-calendar/dialogs/vitals-dialog.tmpl.html',            
               parent: angular.element(document.body),
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
               templateUrl: 'app/air/earnings-calendar/dialogs/headlines-dialog.tmpl.html',            
               parent: angular.element(document.body),
               targetEvent: e
           });
       };
 
    // Price Filters
    vm.priceFilterActive = false;  
    vm.price = function(entry) {
        if(vm.priceFilterActive >= 0 ) {
          if(vm.priceFilterActive) { return (entry.price > vm.priceFilterActive) ? true: false;}
          return true;
          }
        if(vm.priceFilterActive < 0 ) {
          var underPrice = vm.priceFilterActive
          underPrice = underPrice * -1;
          if(vm.priceFilterActive) { return (entry.price < underPrice) ? true: false;}
          return true;
          }
    }
    vm.priceFilter = function() {if (vm.price != 0){ return true;}}

    // Volume Filters
    vm.volumeFilterActive = false; 
    vm.volume = function(entry) {
        if(vm.volumeFilterActive >= 0 ) {
          if(vm.volumeFilterActive) { return (entry.volume > vm.volumeFilterActive) ? true: false;}
          return true;
          }
        if(vm.volumeFilterActive < 0 ) {
          var underVolume = vm.volumeFilterActive
          underVolume = underVolume * -1;
          if(vm.volumeFilterActive) { return (entry.volume < underVolume) ? true: false;}
          return true;
          }
    }
    vm.volumeFilter = function() {if (vm.volume != 0){ return true;}}
    
    // Average Volume Filters
    vm.avgVolFilterActive = false; 
    vm.avgVol = function(entry) {
        if(vm.avgVolFilterActive >= 0 ) {
          if(vm.avgVolFilterActive) { return (entry.avgVol > vm.avgVolFilterActive) ? true: false;}
          return true;
          }
        if(vm.avgVolFilterActive < 0 ) {
          var underAvgVol = vm.avgVolFilterActive
          underAvgVol = underAvgVol * -1;
          if(vm.avgVolFilterActive) { return (entry.avgVol < underAvgVol) ? true: false;}
          return true;
          }
    }
    vm.avgVolFilter = function() {if (vm.avgVol != 0){ return true;}}
    
    // Market Cap Filters
    vm.mktCapFilterActive = false;
    vm.mktCap = function(entry) {
        if(vm.mktCapFilterActive >= 0 ) {
          if(vm.mktCapFilterActive) { return (entry.marketCap > vm.mktCapFilterActive) ? true: false;}
          return true;
          }
        if(vm.mktCapFilterActive < 0 ) {
          var underMktCap = vm.mktCapFilterActive
          underMktCap = underMktCap * -1;
          if(vm.mktCapFilterActive) { return (entry.marketCap < underMktCap) ? true: false;}
          return true;
          }
    }
    vm.mktCapFilter = function() {if (vm.mktCap != 0){ return true;}}

    // Float Filters
    vm.floatFilterActive = false;
    vm.float = function(entry) {
        if(vm.floatFilterActive >= 0 ) {
          if(vm.floatFilterActive) { return (entry.float > vm.floatFilterActive) ? true: false;}
          return true;
          }
        if(vm.floatFilterActive < 0 ) {
          var underfloat = vm.floatFilterActive
          underfloat = underfloat * -1;
          if(vm.floatFilterActive) { return (entry.float < underfloat) ? true: false;}
          return true;
          }
    }
    vm.floatFilter = function() {if (vm.float != 0){ return true;}}

    // Short Filters
    vm.shortFilterActive = false;
    vm.short = function(entry) {
        if(vm.shortFilterActive >= 0 ) {
          if(vm.shortFilterActive) { return (entry.shortPercent > vm.shortFilterActive) ? true: false;}
          return true;
          }
    }
    vm.shortFilter = function() {if (vm.short != 0){ return true;}}
    
    // Announcement Time Filters
    vm.timeFilterActive = false;
    vm.time = function(entry) {
        if(vm.timeFilterActive >= 0 ) {
          if(vm.timeFilterActive) { return (entry.time == vm.timeFilterActive) ? true: false;}
          return true;
          }
    }
    vm.timeFilter = function() {if (vm.time != 0){ return true;}}

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
    };
    // Get current path.  Using this to show/hide before/after market announcement filter
    vm.currentPath = $location.path();


    };
})();
