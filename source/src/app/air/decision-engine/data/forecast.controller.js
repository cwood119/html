(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .controller('forecastController', forecastController);

    /* @ngInject */
    function forecastController(API_CONFIG,ForecastService) {
        var vm = this;

        vm.rows = [];
        getForecastData(API_CONFIG).then(function(data) {
            var forecast = data[0].data;
            vm.firstForecast = data[0].data[0].date;
            var last = data[0].data.length-1;
            vm.lastForecast = data[0].data[last].date; 
            angular.forEach(forecast,function(value){
                var date = value.date;
                var count = value.count;
                var obj = { c: [ {v:new Date(date)},{v:count}  ]  };
                vm.rows.push(obj);
console.log(vm.rows);
            });
        });
        vm.forecastData = {
            type: 'AreaChart',
            data: {
                'cols': [
                    {id: 'day', label: 'Day', type: 'date'},
                    {id: 'count', label: 'Announcements', type: 'number'}
                ],
                'rows': vm.rows

            },
            options: {
                legend: { position: 'bottom' },
                colors: ['#03A9F4'],
                vAxis: { gridlines: { color: 'transparent' } },
                hAxis: { gridlines: { color: '#EEEEEE' } },
                width: '100%',
            }
        };

        // Get Data from Service
        function getForecastData(API_CONFIG) {
            return ForecastService.getForecastData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }
    }
})();
