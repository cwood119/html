(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('DashboardService', DashboardService);

    /* @ngInject */
    function DashboardService($http) {
        var service = {
            getData: getData
            //getWidgetData: getWidgetData
        };

        return service;
        function getWidgetData() {
            var ecalData = $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
            .then(function(ecalResponse) {
                var ecalDaily = ecalResponse.data;
                return ecalDaily;
            });
            return ecalData;
        }
        function getData(start, end, span) {
            var startTime = angular.copy(start);
            var endTime = angular.copy(end);
            var data = {
                ecalLineChartData: [{
                    key: 'Announcements',
                    values: [],
                    area: true
                }],
                totals: {
                    ecal: 0
                }
            };

            // 30 Day Calendar Retro
            var dataset;
            d3.csv('app/air/decision-engine/data/ecal-history.csv?ts='+new Date().getTime(), function(error, data) {
                dataset = data.map(function(d) { return [ +d['date'], +d['count'] ]; });
                loop();
            });
            function loop() {
                for (var m = startTime; m.diff(endTime, span) <= 0; m.add(1, span)) {
                    var i = m.diff(endTime, span) * -1;
                    var ecal = dataset[i][1];
                    data.ecalLineChartData[0].values.push([m.clone().toDate(), ecal]);
                    data.totals.ecal += ecal;
                }
            }

            // calculate average for pagesessions
            //data.totals.pagesessions = data.totals.pagesessions / data.pagesSessionsLineChartData[0].values.length;
            //data.totals.pagesessions = data.totals.pagesessions.toFixed(2);

            // calculate average for avgsessions
            //data.totals.avgsessions = Math.floor(data.totals.avgsessions / data.avgSessionLineChartData[0].values.length);

            // calculate average for bounces
            //data.totals.bounces = data.totals.bounces / data.bounceLineChartData[0].values.length;

            return data;
        }
    }
})();
