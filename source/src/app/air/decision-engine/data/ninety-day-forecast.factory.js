(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('NinetyDayForecastService', NinetyDayForecastService);

    /* @ngInject */
    function NinetyDayForecastService() {
        var service = {
            getForecastData: getForecastData
        };

        return service;
        function getForecastData(start, end, span) {
            var startTime = angular.copy(start);
            var endTime = angular.copy(end);
            var forecastData = {
                ninetyDayForecastData: [{
                    key: 'Announcements',
                    values: [],
                    area: true
                }],
                totals: {
                    ecal: 0
                }
            };

            // 30 Day Calendar Forecast 
            var dataset;
            d3.csv('app/air/decision-engine/data/ecal-forecast.csv?ts='+new Date().getTime(), function(error, forecastData) {
                dataset = forecastData.map(function(d) { return [ +d['date'], +d['count'] ]; });
                loop();
            });
            function loop() {
                for (var m = startTime; m.diff(endTime, span) <= 0; m.add(1, span)) {
                    if ( span == 'months' ) {
                        console.log('m is '+m.toDate());
                        console.log('m + 1 '+span+' is '+m.add(1, span).toDate());
                        // var ecal = count all announcements between m and m.add(1, span);
                    }
                    var i = m.diff(endTime, span) * -1;
                    var ecal = dataset[i][1];
//console.log(dataset);
//console.log(ecal);
                    forecastData.ninetyDayForecastData[0].values.push([m.clone().toDate(), ecal]);
                    forecastData.totals.ecal += ecal;
                }
            }

            return forecastData;
        }
    }
})();
