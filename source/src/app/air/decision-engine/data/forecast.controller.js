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
                var date = new Date(value.date);
                date.setDate(date.getDate() + 1);

                var count = value.count;
                var obj = { c: [ {v:date},{v:count}  ]  };
                vm.rows.push(obj);
            });
        });

        vm.forecastData = {
            type: 'Bar',
            data: {
                'cols': [
                    {id: 'day', type: 'date'},
                    {id: 'count', label: 'Announcements', type: 'number'}
                ],
                'rows': vm.rows
            },
            options: {
                legend: { position: 'none' },
                colors: ['#03A9F4']
                //chartArea: {width: '100%', height: '80%'},
                //vAxis: { gridlines: { color: 'transparent' }, legend: { position:'none' },textPosition: 'none' },
                //hAxis: { gridlines: { color: 'transparent' }, legend: { position:'none' } },
                //tooltip: {isHtml: true},

                //width: '100%',
                //height: '100%'
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
