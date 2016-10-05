(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('chartController', chartController);

    /* @ngInject */
    function chartController() {
        var vm = this;
        vm.chartData = {
            type: 'Line',
            data: {
                'cols': [
                    {id: 'date', label: '', type: 'date'},
                    {id: 'price', label: 'Closing Price', type: 'number'},
                ],
                'rows': [
                    { c: [ { v: new Date(2016, 9, 2) }, { v: 42 }, ] },
                    { c: [ { v: new Date(2016, 9, 3) }, { v: 45 }, ] },
                    { c: [ { v: new Date(2016, 9, 4) }, { v: 43 }, ] },
                    { c: [ { v: new Date(2016, 9, 5) }, { v: 45 }, ] },
                    { c: [ { v: new Date(2016, 9, 8) }, { v: 47 }, ] },
                    { c: [ { v: new Date(2016, 9, 9) }, { v: 48 }, ] },
                    { c: [ { v: new Date(2016, 9, 10) }, { v: 50 }, ] },
                    { c: [ { v: new Date(2016, 9, 11) }, { v: 48 }, ] },
                    { c: [ { v: new Date(2016, 9, 12) }, { v: 50 }, ] },
		]
            },
            options: {
                chart: {
                    /*title: 'Box Office Earnings in First Two Weeks of Opening',
                    subtitle: 'in millions of dollars (USD)'*/
                },

		    hAxis: { 
			pointSize: 2,
			format: 'MMM d',
			title: '',
			titlePosition: 'none'
		    },
		legend: {position: 'none'},
                width: '100%',
                height: 200,
		
            },
formatters: {"date": [{
    columnNum: 0, // column index to apply format to
    pattern: "MMM d, yyyy"
  }]}
        };
    }
})();
