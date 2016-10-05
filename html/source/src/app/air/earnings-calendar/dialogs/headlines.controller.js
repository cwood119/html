(function() {
    'use strict';

    angular
        .module('app.air.earnings-calendar')
        .controller('headlineController', headlineController);

    /* @ngInject */
    function headlineController($mdDialog) {
        var vm = this;
        vm.createDialog = createDialog;
	vm.cancelClick = cancelClick;
        function createDialog($event, dialog) {
            $mdDialog.show({
                templateUrl: 'app/air/earnings-calendar/dialogs/headline-dialog.tmpl.html',
                targetEvent: $event
            });
        }
	function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
