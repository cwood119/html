(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .factory('NinetyDayLookbackService', NinetyDayLookbackService);

    /* @ngInject */
    function NinetyDayLookbackService() {
        var service = {
            getLookbackData: getLookbackData
            //getWidgetLookbackData: getWidgetLookbackData
        };

        return service;
/*        function getWidgetLookbackData() {
            var ecalData = $http.get('app/air/decision-engine/data/ecal-daily-data.json?ts='+new Date().getTime())
            .then(function(ecalResponse) {
                var ecalDaily = ecalResponse.data;
                return ecalDaily;
            });
            return ecalData;
        }
*/
        function getLookbackData(start, end, span) {
            var startTime = angular.copy(start);
            var endTime = angular.copy(end);
            var lookbackData = {
                ninetyDayLookbackData: [{
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
            d3.csv('app/air/decision-engine/data/ecal-history.csv?ts='+new Date().getTime(), function(error, lookbackData) {
                dataset = lookbackData.map(function(d) { return [ +d['date'], +d['count'] ]; });
                loop();
            });
            function loop() {
                for (var m = startTime; m.diff(endTime, span) <= 0; m.add(1, span)) {
                    var i = m.diff(endTime, span) * -1;
                    var ecal = dataset[i][1];
                    lookbackData.ninetyDayLookbackData[0].values.push([m.clone().toDate(), ecal]);
                    lookbackData.totals.ecal += ecal;
                }
            }

            return lookbackData;
        }
    }
})();
