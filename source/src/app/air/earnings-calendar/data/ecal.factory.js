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
            getHistoricalQuotes: getHistoricalQuotes,
            getHeadlines: getHeadlines
        };

        return service;

        function getData(API_CONFIG, d, today) {
            if (d == today) { var ecalData = $http.get(API_CONFIG.url + 'ecalUpdate'); }
            else { var ecalData = $http.get(API_CONFIG.url + 'ecalUpdateSnapshot/' + d); }
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

        function getHistoricalQuotes(s,d) {
            if (s != '') {
                var y = moment(d).subtract(1,'day');
                var start = moment(y).format('YYYY-MM-DD');
                var quotes = $http.get('https://api.tradier.com/v1/markets/history?symbol=' + s + '&start=' + start + '&end=' + d, tradier);
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

        function getSymbolData(s,id,w,ts,av,d,today) {
            if (symbol != '') {
                var announce = w;
                var avgVol = av;
                var symbol = s;
                var timestamp = ts;
                var historicalQuotes = [];
                //var dataPoints = $http.get('https://api.intrinio.com/data_point?identifier=' + s + '&item=average_daily_volume,marketcap', intrinio);
                if (d == today) { var timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + symbol + '&interval=5min', tradier); }
                else {
                    var timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + symbol + '&start=' + d + ' 09:30&end=' + d + ' 16:00&interval=5min', tradier);
                    var y = moment(d).subtract(1,'day');
                    var start = moment(y).format('YYYY-MM-DD');
                    var historicalQuotes = $http.get('https://api.intrinio.com/prices?symbol=' + s + '&start_date=' + start + '&end_date=' + d, intrinio);
                 }
                return $q.all([symbol, id, announce, timestamp, timeSales, avgVol, historicalQuotes]);
            }

        }
    }
})();
