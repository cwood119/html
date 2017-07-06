(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('RightSidenavController', RightSidenavController);

    /* @ngInject */
    function RightSidenavController($scope, $http, $mdSidenav, $state, API_CONFIG) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Triggered',
            notifications: [{
                title: 'WLL at or above 9',
                icon: 'zmdi zmdi-notifications-active',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            },{
                title: 'OCN at or above 4.40',
                icon: 'zmdi zmdi-notifications-active',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            },{
                title: 'FCX at or above 11',
                icon: 'zmdi zmdi-notifications-active',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            },{
                title: 'AMD at or above 7.50',
                icon: 'zmdi zmdi-notifications-active',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            }]
        },{
            name: 'Active',
            notifications: [{
                title: 'WLL at or above 9',
                icon: 'zmdi zmdi-notifications',
                iconColor: '#4caf50'
            },{
                title: 'OCN at or above 4.40',
                icon: 'zmdi zmdi-notifications',
                iconColor: '#4caf50'
            },{
                title: 'FCX at or above 11',
                icon: 'zmdi zmdi-notifications',
                iconColor: '#4caf50'
            },{
                title: 'AMD at or above 7.50',
                icon: 'zmdi zmdi-notifications',
                iconColor: '#4caf50'
            }]
        }];
        vm.settingsGroups = [{
            name: 'Notifications',
            settings: [{
                title: 'Alerts are updated',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            },{
                title: 'Watchlist is updated',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            },{
                title: 'Notify me when new alerts are added',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Notification Settings',
            settings: [{
                title: 'Email Notifications',
                icon: 'zmdi zmdi-email',
                enabled: true
            },{
                title: 'Browser Push Notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: false
            },{
                title: 'Mobile Push Notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        }];
/*
        vm.statisticsGroups = [{
            name: 'User Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        },{
            name: 'Server Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        }];
*/
        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

        // Get Watchlist Symbols
        $http({
            method: 'GET',
            url: API_CONFIG.url + 'watchlist'
        }).then(function(data) {
            vm.watchlist = data;
        });

        function close() {
            $mdSidenav('notifications').close();
        }
    }
})();
