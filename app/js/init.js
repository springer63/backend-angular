var myApp = angular.module('myAppName', ['angle']);

//配置路由
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.demo', {
                url: '/demo',
                title: 'Demo',
                templateUrl: helper.basepath('uc-demo.html'),
                resolve: helper.resolveFor('datetimepicker', 'textAngular', 'textAngularSetup', 'ui.tree', 'demoController')
            })
            .state('app.user', {
                url: '/user',
                title: '用户管理',
                templateUrl: helper.basepath('user.html'),
                resolve: helper.resolveFor('datetimepicker', 'textAngular', 'textAngularSetup', 'userController')
            })
            .state('app.role', {
                url: '/role',
                title: '角色管理',
                templateUrl: helper.basepath('role.html'),
                resolve: helper.resolveFor('roleController')
            })
            .state('app.resource', {
                url: '/resource',
                title: '资源管理',
                templateUrl: helper.basepath('resource.html'),
                resolve: helper.resolveFor('resourceController')
            })
            .state('app.application', {
                url: '/application',
                title: '应用管理',
                templateUrl: helper.basepath('application.html'),
                resolve: helper.resolveFor('applicationController')
            })
            .state('app.push', {
                url: '/push',
                title: '推送列表',
                templateUrl: helper.basepath('push/pushList.html'),
                resolve: helper.resolveFor('datetimepicker', 'pushController')
            });

    }]);

