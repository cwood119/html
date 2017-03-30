(function() {
    'use strict';

    angular
        .module('triangular.directives')
        .directive('showFocus', showFocus);

    /* @ngInject */
    function showFocus($timeout) {
        return function(scope, element, attrs) {
            scope.$watch(attrs.showFocus,
              function (newValue) {
                  $timeout(function() {
                      newValue && element[0].focus();
                  });
              },true);
        };
    }
})();
