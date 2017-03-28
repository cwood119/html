(function() {
    'use strict';

    angular
        .module('app.air.market-movers')
        .controller('moversDialogController', moversDialogController);

    /* @ngInject */
    function moversDialogController($mdDialog) {
        var vm = this;
        vm.cancelClick = cancelClick;
        function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
