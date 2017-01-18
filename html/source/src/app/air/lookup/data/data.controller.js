(function() {
    'use strict';
    angular
        .module('app.air.lookup')
        .controller('lookupController', lookupController);

    /* @ngInject */
    function lookupController($http, $location, $window, $timeout, $q) {
        var vm = this;
        vm.symbol = '';
        vm.toggle = false;
        vm.reset =  function reset() {
            vm.symbolLookup.$setPristine();
            vm.symbolLookup.$setUntouched();
            vm.symbol = null;
            var timer = $timeout(function() {
                vm.symbol = '';
                vm.toggle = false;
                $timeout.cancel(timer);
            });
        };
        vm.lookup = function submit() {
            var tradier = {
                headers:  {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6'
                }
            };
            var intrinio = {
                headers:  {
                    'Accept': 'application/json',
                    'Authorization': 'Basic ' + window.btoa('506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            if (vm.symbol != '') {
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + vm.symbol, tradier);
                var fundamentals = $http.get('https://api.tradier.com/beta/markets/fundamentals/company?symbols=' + vm.symbol, tradier);
                var headlines = $http.get('https://api.intrinio.com/news?ticker=' + vm.symbol, intrinio);
                $q.all([quotes, fundamentals, headlines]).then(function(data){ 
                    vm.quotes = data[0].data.quotes.quote;
                    vm.fundamentals = data[1].data[0].results[1].tables;
                    vm.headlines = data[2].data.data;
                    vm.toggle = true;
                });
            }

            // Get current path
            vm.currentPath = $location.path();
        };
    }
})();
