(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .controller('lookbackController', lookbackController);

    /* @ngInject */
    function lookbackController(API_CONFIG,LookbackService) {
        var vm = this;

        vm.rows = [];
        getLookbackData(API_CONFIG).then(function(data) {
            var lookback = data[0].data;
            vm.firstLookback = data[0].data[0].date;
            var last = data[0].data.length-1;
            vm.lastLookback = data[0].data[last].date; 
            angular.forEach(lookback,function(value){
                var date = value.date;
                var count = value.count;
                var obj = { c: [ {v:new Date(date)},{v:count}  ]  };
                vm.rows.push(obj);
            });
        });
        vm.lookbackData = {
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
                //width: '100%',
                //height: '100%'
            }

        };

        // Get Data from Service
        function getLookbackData(API_CONFIG) {
            return LookbackService.getLookbackData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }
    }
})();
