(function() {
    'use strict';

    angular
        .module('app.air', [
            'app.air.decision',
            'app.air.watchlist',
            'app.air.alerts',
            'app.air.earnings-calendar',
            'app.air.market-movers',
            //'app.air.lookup'
        ]);
})();