(function() {
    'use strict';

    angular
        .module('app.air', [
            'app.air.earnings-calendar',
            'app.air.decision-engine',
            'app.air.market-movers',
	    'app.air.watchlist'
        ]);
})();
