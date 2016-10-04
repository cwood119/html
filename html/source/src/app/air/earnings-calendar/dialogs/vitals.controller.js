(function() {
    'use strict';

    angular
        .module('app.air.earnings-calendar')
        .controller('vitalsController', vitalsController);

    /* @ngInject */
    function vitalsController($mdDialog) {
        var vm = this;
        vm.createDialog = createDialog;
	vm.cancelClick = cancelClick;
        function createDialog($event, dialog) {
            $mdDialog.show({
                templateUrl: 'app/air/earnings-calendar/dialogs/vitals-dialog.tmpl.html',
                targetEvent: $event
            });
        }
	function cancelClick() {
            $mdDialog.cancel();
        }
    }
})();
