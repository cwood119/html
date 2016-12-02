(function() {
    'use strict';

    angular
        .module('app.air.decision')
        .component('counterWidget', {
            templateUrl: 'app/air/decision-engine/widgets/counter-widget/counter-widget.tmpl.html',
            controllerAs: 'vm',
            bindings: {
                title: '@',
                count: '<',
                icon: '@',
                background: '@',
                color: '@'
            }
        });
})();
