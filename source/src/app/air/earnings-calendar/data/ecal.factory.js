(function() {
    'use strict';

    angular
        .module('app.air.earnings-calendar')
        .factory('ecalService', ecalService);

    /* @ngInject */

    function ecalService($http, $q) {
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
            getBulkQuotes: getBulkQuotes,
            getHeadlines: getHeadlines
        };

        return service;

        function getData(API_CONFIG) {
            var ecalData = $http.get(API_CONFIG.url + 'ecalUpdate');
            return $q.all([ecalData]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getBulkQuotes(s) {
            if (s != '') {
                var symbols = s;
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbols, tradier);
                return $q.all([quotes]);
            }
        }

        function getSymbolQuotes(s) {
            if (s != '') {
                var symbols = s;
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbols, tradier);
                return $q.all([quotes]);
            }
        }

        function getSymbolData(s,id,w,ts,av) {
            if (symbol != '') {
                var announce = w;
                var avgVol = av;
                var symbol = s;
                var timestamp = ts;
                //var dataPoints = $http.get('https://api.intrinio.com/data_point?identifier=' + s + '&item=average_daily_volume,marketcap', intrinio);
                var timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + symbol + '&interval=5min', tradier);
                return $q.all([symbol, id, announce, timestamp,timeSales,avgVol]);
            }

        }
    }
})();
