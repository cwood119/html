(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('decisionController', decisionController);

    /* @ngInject */
    function decisionController($http, $mdDialog, $location, $document, $timeout, $mdToast, $interval, $scope) {
        var vm = this;
// Initialize random data for the demo
        var now = moment().endOf('day').toDate();
        var year_ago = moment().startOf('day').subtract(1, 'year').toDate();
        $scope.texample_data = d3.time.days(year_ago, now).map(function (dateElement) {
          return {
            date: dateElement,
            details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
              return {
                'name': 'Project ' + Math.floor(Math.random() * 10),
                'date': function () {
                  var projectDate = new Date(dateElement.getTime());
                  projectDate.setHours(Math.floor(Math.random() * 24))
                  projectDate.setMinutes(Math.floor(Math.random() * 60));
                  return projectDate;
                }(),
                'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600)
              }
            }),
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
          }.init();
        });
$scope.example_data = [{
  "date": "2016-01-01",
  "total": 805,
  "details": [{
    "name": "Pre Market",
    "date": "2016-01-01 12:30:45",
    "value": 100
  }, {
    "name": "Intraday",
    "date": "2016-01-01 13:37:00",
    "value": 5
  },
  {
    "name": "After Market",
    "date": "2016-01-01 17:52:41",
    "value": 200
  }, {
    "name": "Not Specified",
    "date": "2016-01-01 13:37:00",
    "value": 500
  }]
}];
        // Set custom color for the calendar heatmap
        $scope.color = '#FF5722';

        // Set overview type (choices are year, month and day)
        $scope.overview = 'year';

        // Handler function
        $scope.print = function (val) {
          console.log(val);
        };
}
})();
