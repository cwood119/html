(function() {
    'use strict';

    angular
        .module('app.air.ecal-after')
        .factory('ecalAfterService', ecalAfterService);

    /* @ngInject */

    function ecalAfterService($http, $q) {
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
            getBulkQuotes: getBulkQuotes,
            getClock: getClock,
            getData: getData,
            getSymbolData: getSymbolData,
            getSnapshot: getSnapshot,
            getHeadlines: getHeadlines
        };

        return service;

        function getBulkQuotes(s) {
            if (s != '') {
                var symbols = s;
                var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbols, tradier);
                return $q.all([quotes]);
            }
        }

        function getClock() {
            var clock = $http.get('https://api.tradier.com/v1/markets/clock', tradier);
            return $q.all([clock]);
        }

        function getData(API_CONFIG) {
            var ecalData = $http.get(API_CONFIG.url + 'ecal');
            return $q.all([ecalData]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getSnapshot(API_CONFIG) {
            var snapshot = $http.get(API_CONFIG.url + 'ecalAfter');
            return $q.all([snapshot]);
        }

        function getSymbolData(s,ts) {
            var today = moment().format('YYYY-MM-DD');
            var timeSales;

            if (s != '') {
                if ( ts == today ) { timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + s + '&interval=5min', tradier); return $q.all([s, timeSales]); }
                else { timeSales = $http.get('https://api.tradier.com/v1/markets/timesales?symbol=' + s + '&interval=5min&start=' + ts +' 09:30&end=' + ts + ' 20:00', tradier); return $q.all([s, timeSales]); }
            }
        }
    }
})();
