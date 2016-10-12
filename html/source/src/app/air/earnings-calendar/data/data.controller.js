(function() {
    'use strict';
    angular
        .module('app.air.earnings-calendar')
        .controller('dataController', dataController);

    /* @ngInject */
    function dataController($http, $mdDialog) {
        var vm = this;
        // Get vitals data
        $http.get("app/air/earnings-calendar/data/data.json")
          .then(function(response) {
           vm.symbolData = response.data;
          });

       // Vitals Modal
       vm.openVitals = function (e, symbol) {
           $mdDialog.show({
               clickOutsideToClose: true,
               controller: function ($mdDialog) {
                   var vm = this;
                   vm.symbol = {};
                   vm.symbol = symbol;
                   vm.cancelClick = function () {
                       $mdDialog.cancel();
                   };
               },
               controllerAs: 'modal',
               templateUrl: 'app/air/earnings-calendar/dialogs/vitals-dialog.tmpl.html',            
               parent: angular.element(document.body),
               targetEvent: e
           });
       };

       // Headlines Modal
       vm.openHeadlines = function (e, symbol) {
           $mdDialog.show({
               clickOutsideToClose: true,
               controller: function ($mdDialog) {
                   var vm = this;
                   vm.symbol = {};
                   vm.symbol = symbol;
                   vm.cancelClick = function () {
                       $mdDialog.cancel();
                   };
               },
               controllerAs: 'modal',
               templateUrl: 'app/air/earnings-calendar/dialogs/headlines-dialog.tmpl.html',            
               parent: angular.element(document.body),
               targetEvent: e
           });
       };
       /*$http.get("app/air/earnings-calendar/data/BBRY-headlines.json")
          .then(function(response) {
           vm.headlineData = response.data;
          });
        $http.get("app/air/earnings-calendar/data/BBRY-vitals.json")
          .then(function(response) {
           vm.vitalsData = response.data;
          });*/
    };
})();
