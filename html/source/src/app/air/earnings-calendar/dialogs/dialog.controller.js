(function() {
    'use strict';

    angular
        .module('app.air.earnings-calendar')
        .controller('ecalDialogController', ecalDialogController);

    /* @ngInject */
    function ecalDialogController($mdDialog) {
        var vm = this;
        vm.cancelClick = cancelClick;
        function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
