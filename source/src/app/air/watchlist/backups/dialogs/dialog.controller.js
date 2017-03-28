(function() {
    'use strict';

    angular
        .module('app.air.watchlist')
        .controller('watchlistDialogController', watchlistDialogController);

    /* @ngInject */
    function watchlistDialogController($mdDialog) {
        var vm = this;
        vm.cancelClick = cancelClick;
        function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
