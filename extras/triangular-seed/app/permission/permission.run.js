(function() {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);


    function permissionRun($rootScope, $cookies, $state, RoleStore, UserService) {
        // normally this would be done at the login page but to show quick
        // demo we grab username from cookie and login the user
        var cookieUser = $cookies.get('tri-user');
        if(angular.isDefined(cookieUser)) {
            UserService.login(cookieUser);
        }

        // create roles for app
        RoleStore
        .defineRole('SUPERADMIN', ['viewEmail', 'viewGitHub', 'viewCalendar', 'viewLayouts', 'viewTodo', 'viewElements', 'viewAuthentication', 'viewCharts', 'viewMaps'], checkRole);
        RoleStore
        .defineRole('ADMIN', ['viewLayouts', 'viewTodo', 'viewElements', 'viewAuthentication', 'viewCharts', 'viewMaps'], checkRole);
        RoleStore
        .defineRole('USER', ['viewAuthentication', 'viewCharts', 'viewMaps'], checkRole);
        RoleStore
        .defineRole('ANONYMOUS', [], checkRole);


        ///////////////////////

        // default redirect if access is denied
        function accessDenied() {
            $state.go('401');
        }

        // function that calls user service to check if permission is allowed
        function checkRole(permission, transitionProperties) {
            return UserService.hasPermission(permission, transitionProperties);
        }

        // watches

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            deniedHandle();
        });
    }
})();
