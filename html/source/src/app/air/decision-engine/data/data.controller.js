(function() {
    'use strict';
    angular
        .module('app.air.decision')
        .controller('decisionController', decisionController);

    /* @ngInject */
    function decisionController($http, $mdDialog, $location, $document, $timeout, $mdToast, $interval) {
        var vm = this;

        // Get current path.  Using this to show/hide before/after market announcement filter
        vm.currentPath = $location.path();
    }
})();
