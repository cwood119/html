(function() {
    'use strict';

    angular
        .module('app.air.alerts')
        .controller('alertsDialogController', alertsDialogController);

    /* @ngInject */
    function alertsDialogController($mdDialog) {
        var vm = this;
        vm.cancelClick = cancelClick;
        function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
