(function() {
    'use strict';
    angular
        .module('app.air.chart')
        .factory('chartService', chartService);

    /* @ngInject */

    function chartService($http, $q) {
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

        function getData(API_CONFIG, list) {
            var symbolsList = $http.get(API_CONFIG.url + list);
            return $q.all([symbolsList]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getSymbolData(s,id,ad,ts,av,API_CONFIG,tp,erClose,latestClose,change,percentChange,list) {
            if (symbol != '') {
                var symbol = s;
                var added = ad;
                var timestamp = ts;
                var avgVol = av;
                var triggerPrice = tp;
                if (list != 'ecalNext'){ var when = $http.get(API_CONFIG.url + 'when/' + symbol); }
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbol, tradier);
                var company = $http.get('https://api.iextrading.com/1.0/stock/' + symbol + '/company');
                var stats = $http.get('https://api.iextrading.com/1.0/stock/' + symbol + '/stats');
                var headlines = $http.get('https://api.intrinio.com/news?ticker=' + symbol, intrinio);
                var logo = $http.get('https://api.iextrading.com/1.0/stock/' + symbol + '/logo');
                var previous = $http.get('https://api.iextrading.com/1.0/stock/' + symbol + '/previous');
                
                return $q.all([quotes, symbol, id, timestamp, avgVol, added, when, triggerPrice,erClose,latestClose,change,percentChange,company,stats,headlines,logo,previous]);
            }
        }
    }
})();
