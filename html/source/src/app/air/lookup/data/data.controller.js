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
            var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + vm.symbol, tradier);
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + vm.symbol, intrinio);
            $q.all([quotes, headlines]).then(function(data){ 
                //console.log(data[0]); 
                vm.quotes = data[0].data.quotes.quote;
                //console.log(data[1]); 
                vm.toggle = true;
            });


            // Get current path
            vm.currentPath = $location.path();
        };
    }
})();
