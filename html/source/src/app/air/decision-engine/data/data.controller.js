(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('decisionController', decisionController);

    /* @ngInject */
    function decisionController($http, $mdDialog, $location, $document, $timeout, $mdToast, $interval, $window) {
        var vm = this;
        // Get data
        $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
            .then(function(ecalResponse) {
                vm.ecalDaily = ecalResponse.data;
                vm.ecalDailyList = ecalResponse.data[0].list;
                vm.ecalDailyCurPage = 1;
                vm.ecalDailyLimitOptions = [6,12,24];
                vm.ecalDailyPageSize = 12;
            });
        $http.get('app/air/decision-engine/data/ecal-pre-data.json?ts='+new Date().getTime())
            .then(function(preResponse) {
                vm.ecalPre = preResponse.data;
                vm.ecalPreList = preResponse.data[0].list;
                vm.ecalPreCurPage = 1;
                vm.ecalPreLimitOptions = [6,12,24];
                vm.ecalPrePageSize = 12;
            });
        $http.get('app/air/decision-engine/data/ecal-after-data.json?ts='+new Date().getTime())
            .then(function(afterResponse) {
                vm.ecalAfter = afterResponse.data;
                vm.ecalAfterList = afterResponse.data[0].list;
                vm.ecalAfterCurPage = 1;
                vm.ecalAfterLimitOptions = [6,12,24];
                vm.ecalAfterPageSize = 12;
            });
        $http.get('app/air/decision-engine/data/ecal-intraday-data.json?ts='+new Date().getTime())
            .then(function(intradayResponse) {
                vm.ecalIntraday = intradayResponse.data;
                vm.ecalIntradayList = intradayResponse.data[0].list;
                vm.ecalIntradayCurPage = 1;
                vm.ecalIntradayLimitOptions = [6,12,24];
                vm.ecalIntradayPageSize = 12;
            });
        $http.get('app/air/decision-engine/data/gainers-intraday-data.json?ts='+new Date().getTime())
            .then(function(gainersResponse) {
                vm.gainersIntraday = gainersResponse.data;
                vm.gainersIntradayList = gainersResponse.data[0].list;
                vm.gainersIntradayCurPage = 1;
                vm.gainersIntradayLimitOptions = [6,12,24];
                vm.gainersIntradayPageSize = 12;
            });
        $http.get('app/air/decision-engine/data/watchlist-data.json?ts='+new Date().getTime())
            .then(function(watchlistResponse) {
                vm.watchlist = watchlistResponse.data;
                vm.watchlistList = watchlistResponse.data[0].list;
                vm.watchlistCurPage = 1;
                vm.watchlistLimitOptions = [6,12,24];
                vm.watchlistPageSize = 12;
            });
        $http.get('app/air/decision-engine/data/alerts-data.json?ts='+new Date().getTime())
            .then(function(alertsResponse) {
                vm.alerts = alertsResponse.data;
                vm.alertsList = alertsResponse.data[0].list;
                vm.alertsCurPage = 1; 
                vm.alertsLimitOptions = [6,12,24];
                vm.alertsPageSize = 12;
            });


        // Get current path.  Using this to show/hide before/after market announcement filter
        vm.currentPath = $location.path();
    }
})();
