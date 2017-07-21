(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('ecalTrackerService', ecalTrackerService);

    /* @ngInject */

    function ecalTrackerService($http, $q) {

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
            getSymbolData: getSymbolData
        };

        return service;

        function getListData(API_CONFIG) {
            var ecal = $http.get(API_CONFIG.url + 'ecalTracker');
            return $q.all([ecal]);
        }

        function getHeadlines(symbol) {
            var s = symbol.symbol;
            var headlines = $http.get('https://api.intrinio.com/news?ticker=' + s, intrinio);
            return $q.all([headlines]);
        }

        function getSymbolData(s,id,w,ts,av) {
            if (symbol != '') {
                var announce = w;
                var avgVol = av;
                var symbol = s;
                var timestamp = ts;

                if (announce == 1){ts = moment(ts).add(1,'days').toDate()}
                var startDate = moment(ts).format('YYYYMMDD');

                var history = $http.get('https://api.tradier.com/v1/markets/history?symbol=' + symbol + '&start=' + startDate, tradier);
                //var quotes = $http.get('https://api.tradier.com/v1/markets/quotes?symbols=' + symbol, tradier);
var quotes ='';
                return $q.all([quotes, symbol, id, announce, timestamp,avgVol,startDate]);
            }
        }
    }
})();
