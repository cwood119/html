(function() {
    'use strict';

    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(triSettingsProvider, triRouteProvider) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('AIR');
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' automatedinvestmentresearch.com');
        triSettingsProvider.setLogo('assets/images/Blue-Logo.svg');
        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('2.0');
        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('AIR');
        triRouteProvider.setSeparator('|');
    }
})();
