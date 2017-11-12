(function() {
    'use strict';

    angular
        .module('app.air.alerts')
        .factory('alertsService', alertsService);

    /* @ngInject */

    function alertsService($http, $q) {

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
            var alertsData = $http.get(API_CONFIG.url + 'alerts');
            return $q.all([alertsData]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getSymbolData(s,id,ad,tp,ts,av,API_CONFIG) {
            if (symbol != '') {
                var symbol = s;
                var added = ad;
                var triggerPrice = tp;
                var timestamp = ts;
                var avgVol = av;
                var when = $http.get(API_CONFIG.url + 'when/' + symbol);
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbol, tradier);
                //var dataPoints = $http.get('https://api.intrinio.com/data_point?identifier=' + s + '&item=average_daily_volume,marketcap', intrinio);
                var timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + symbol + '&interval=5min&session_filter=open', tradier);
                return $q.all([quotes, symbol, id, added, triggerPrice, timestamp, timeSales, avgVol, when]);
            }

        }
    }
})();
