(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('dataController', dataController);

    /* @ngInject */
    function dataController($http) {
        var vm = this;
        vm.price = 7.75;
        vm.dollarChange = .04;
        vm.percentChange = .05;
        $http.get("app/air/earnings-calendar/data/BBRY-headlines.json")
          .then(function(response) {
           vm.headlineData = response.data;
          });
    };
})();
