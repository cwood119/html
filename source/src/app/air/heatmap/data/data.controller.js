(function() {
    'use strict';
    angular
        .module('app.air.heatmap')
        .controller('heatmapController', heatmapController);

    /* @ngInject */
    function heatmapController(API_CONFIG,HeatmapService,$mdSidenav) {
        var vm = this;
        vm.openSidebar = function(id) {$mdSidenav(id).toggle();};
        vm.heatmap = [];

        getHeatmapData(API_CONFIG).then(function(data) {
            var heatmap = data[0].data;
            vm.start = data[0].data[0].date;
            var last = data[0].data.length-1;
            vm.end = data[0].data[last].date;
            angular.forEach(heatmap,function(value){
                var date = new Date(value.date);
                date.setDate(date.getDate() + 1);
                var epoch = date.getTime()/1000.0;
                var count = value.count;
                var obj =  {date:epoch, value:count} ;
 
                vm.heatmap.push(obj);
            });
            var parser = function(data) {
                var stats = {};
                for (var d in data) {
                    stats[data[d].date] = data[d].value;
                }
                return stats;
            }; 

            var cal = new CalHeatMap();
            cal.init({
                domain: 'month',
                subDomain: 'x_day',
                range: 5,
                start: new Date(vm.start),
                end: new Date(vm.end),
                data: vm.heatmap,
                afterLoadData: parser,
                itemName: ['announcement', 'announcements'],
                cellSize: 25,
                domainGutter: 5,
                //colLimit: 1,
                legendColors: ['#b3e5fc', '#03a9f4'],
                tooltip: true,
                displayLegend: false,
                weekStartOnMonday: false,
                highlight: 'now',
                domainLabelFormat: function(date) {
                    moment.locale('en');
                    return moment(date).format('MMMM').toUpperCase();
                },
                verticalOrientation: true,
                label: {
                    position: 'top'
                }
            });
        });
        // Get Data from Service
        function getHeatmapData(API_CONFIG) {
            return HeatmapService.getHeatmapData(API_CONFIG)
                .then(function(data) {
                    return data;
                });
        }
    }
})();
