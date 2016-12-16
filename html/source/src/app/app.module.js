(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'triangular',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            'googlechart', 'chart.js', 'linkify', 'ui.calendar', 'angularMoment', 
            'textAngular', 'hljs', 'md.data.table', angularDragula(angular), 'nvd3',
            'app.air'
//, 'g1b.calendar-heatmap'
        ])

        // set a constant for the API we are connecting to
        .constant('API_CONFIG', {
            'url':  'http://triangular-api.oxygenna.com/'
        });
})();
