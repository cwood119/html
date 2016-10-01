(function() {
    'use strict';

    angular
        .module('seed-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.seed-page', {
            url: '/seed-module/seed-page',
            templateUrl: 'app/seed-module/seed-page.tmpl.html',
            // set the controller to load for this page
            controller: 'SeedPageController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Seed Module',
            icon: 'fa fa-tree',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'Start Page',
                state: 'triangular.seed-page',
                type: 'link'
            }]
        });
    }
})();
