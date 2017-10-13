App.controller('demoController', ["$scope", "UC", "i18nService", function($scope, UC, i18nService) {
    i18nService.setCurrentLang('zh-cn');
    $scope.uc = UC.create({
        urlBase: '/security/user',
        updateRefresh: true,
        scope: $scope,
        columnDefs:[
            {name:'realname', displayName:'姓名',  editable: true , type:'text'},
            {name:'username', displayName:'账号',  editable: true , type:'text'},
            {name:'phone', displayName:'手机号',  editable: true , type:'text'},
            {name:'locked', displayName:'锁定状态',  editable: true , type:'text'},
            {name:'addTime', displayName:'注册时间',  editable: false , type:'datetime'},
            {name:'edit', displayName:'操作', width:150, cellTemplate: '<div class="ui-grid-cell-contents" ><button class="btn btn-xs btn-info" ng-click="grid.appScope.uc.edit(row.entity)"><em class="fa fa-pencil"></em></button><button  class="btn btn-xs btn-danger" data-ng-click="grid.appScope.uc.del(row.entity)"><em class="fa fa-trash"></em></button></div>' }
        ]
    });
    $scope.uc.query();
}]);