(function() {
    'use strict';
    angular
        .module('app.air.market-movers')
        .factory('moversService', moversService);

    /* @ngInject */

    function moversService($http, $q) {
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
        var service = {
            getData: getData,
            getSymbolData: getSymbolData,
            getHeadlines: getHeadlines
        };

        return service;

        function getData(API_CONFIG) {
            var moversData = $http.get(API_CONFIG.url + 'gainers');
            return $q.all([moversData]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getSymbolData(s,id,ts,av) {
            if (symbol != '') {
                var symbol = s;
                var timestamp = ts;
                var avgVol = av;
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbol, tradier);
                var timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + symbol + '&interval=5min', tradier);
                return $q.all([quotes, symbol, id, timestamp,timeSales,avgVol]);
            }

        }
    }
})();
