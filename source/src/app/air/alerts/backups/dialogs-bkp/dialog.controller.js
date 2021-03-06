(function() {
    'use strict';

    angular
        .module('app.air')
        .controller('dialogController', dialogController);

    /* @ngInject */
    function dialogController($mdDialog) {
        var vm = this;
        vm.cancelClick = cancelClick;
        function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
