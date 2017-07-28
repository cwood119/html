(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('announcementsService', announcementsService);

    /* @ngInject */

    function announcementsService($http, $q) {

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
            getHeadlines: getHeadlines,
            getListData: getListData,
            getBulkQuotes: getBulkQuotes,
            getSymbolData: getSymbolData
        };

        return service;

        function getListData(API_CONFIG,endpoint) {
            var ecal = $http.get(API_CONFIG.url + endpoint);
            var gainers = $http.get(API_CONFIG.url + 'gainers');
            return $q.all([ecal,gainers]);
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

        function getSymbolData(s,id,w,ts,av) {
            if (symbol != '') {
                var symbol = s;
                var announce = w;
                var timestamp = ts;
                var avgVol = av;
                var startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
                var chartPrices = $http.get('https://api.tradier.com/v1/markets/history?symbol=' + symbol + '&start=' + startDate, tradier);
                //var chartPrices = $http.get('https://api.intrinio.com/prices?identifier=' + symbol + '&start_date=' + startDate, intrinio);
                return $q.all([symbol, id, announce, timestamp,chartPrices,avgVol]);
            }
        }
    }
})();
