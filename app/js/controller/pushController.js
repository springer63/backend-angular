App.controller('pushController', ["$scope", "UC", "i18nService", "Http", "$modal", function ($scope, UC, i18nService, http, $modal) {
    i18nService.setCurrentLang('zh-cn');
    $scope.pushUc = UC.create({
        scope: $scope,
        urlBase: '/push',
        fields: [
            {name: 'id', displayName: 'ID', editable: false, searchable: true, inputType: 'text', width: 80},
            {
                name: 'content',
                displayName: '内容',
                editable: true,
                searchable: false,
                inputType: 'text',
                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.content}}"><span>{{row.entity.content}}</span></div>'
            },
            {name: 'platform', displayName: '平台', editable: true, searchable: true, inputType: 'select', width: 100},
            {
                name: 'targetType',
                displayName: '目标类型',
                editable: true,
                searchable: false,
                inputType: 'select',
                visible: false,
                attrs: {'ng-change': 'uc.selectTarget(model)'}
            },
            {
                name: 'targetValue',
                displayName: '目标值',
                editable: true,
                inputType: 'text',
                visible: false,
                attrs: {'ng-readonly': 'true'},
                ngShow: 'uc.editObj.targetType != "EXCEL"',
                attrs: {'ng-click': 'uc.selectTarget(model)', 'ng-readonly': true}
            },
            {
                name: 'excelPath',
                displayName: 'excel文件',
                editable: true,
                inputType: 'file',
                visible: false,
                ngShow: 'uc.editObj.targetType == "EXCEL"'
            },
            {
                name: 'sourceType',
                displayName: '业务类型',
                editable: true,
                searchable: true,
                inputType: 'select',
                cellFilter: 'msgSourceTypeFilter',
                width: 120
            },
            {
                name: 'sourceValue',
                displayName: '业务值',
                editable: true,
                inputType: 'text',
                width: 80,
                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.sourceValue}}"><span>{{row.entity.sourceValue}}</span></div>'
            },
            {
                name: 'msgType',
                displayName: '消息类型',
                editable: true,
                searchable: true,
                inputType: 'select',
                cellFilter: 'msgTypeFilter',
                width: 120
            },
            {
                name: 'status',
                displayName: '状态',
                editable: false,
                searchable: true,
                inputType: 'select',
                width: 100,
                cellFilter: 'msgStatusFilter'
            },
            {name: 'receiveCount', displayName: '接收量', editable: false, inputType: 'text', width: 80},
            {
                name: 'sendTime',
                displayName: '发送时间',
                editable: true,
                searchable: false,
                inputType: 'datetime',
                cellFilter: 'date : "yyyy-MM-dd HH:mm:ss"',
                attrs: {'ng-readonly': true},
                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.sendTime | date : \'yyyy-MM-dd HH:mm:ss\' }}"><span>{{row.entity.sendTime | date:"yyyy-MM-dd HH:mm:ss"}}</span></div>'
            },
            {
                name: 'createTime',
                displayName: '创建时间',
                editable: false,
                inputType: 'datetime',
                cellFilter: 'date : "yyyy-MM-dd HH:mm:ss"',
                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.createTime | date : \'yyyy-MM-dd HH:mm:ss\' }}"><span>{{row.entity.createTime | date:"yyyy-MM-dd HH:mm:ss"}}</span></div>'
            },
            {
                name: 'startTime',
                displayName: '开始时间',
                editable: false,
                searchable: true,
                inputType: 'datetime',
                visible: false,
                attrs: {'ng-readonly': true}
            },
            {
                name: 'endTime',
                displayName: '结束时间',
                editable: false,
                searchable: true,
                inputType: 'datetime',
                visible: false,
                attrs: {'ng-readonly': true}
            },
            {
                name: 'operation',
                displayName: '操作',
                inputType: 'html',
                cellTemplate: '<div class="ui-grid-cell-contents" ><button class="btn btn-xs btn-info" ng-show="row.entity.status == 0 || row.entity.status == 1" ng-click="grid.appScope.pushUc.edit(row.entity)"><em class="fa fa-pencil"></em></button>' +
                '<button  class="btn btn-xs btn-danger" ng-show="row.entity.status == 0 || row.entity.status == 1" ng-click="grid.appScope.pushUc.del(row.entity)"><em class="fa fa-trash"></em></button></div>'
            }
        ],
        beforeEdit: function (editObj) {
            editObj.sourceTypeOptions = [
                {value: "1", text: "明星圈子"},
                {value: "2", text: "星战"},
                {value: "3", text: "资讯"},
                {value: "4", text: "排行榜"},
                {value: "5", text: "投票"},
                {value: "6", text: "商城"},
                {value: "7", text: "密卷"},
                {value: "8", text: "系统"},
                {value: "9", text: "问答"},
                {value: "10", text: "充值"},
                {value: "11", text: "行程"},
                {value: "12", text: "专题"},
                {value: "13", text: "活动"},
                {value: "14", text: "网页"}
            ];
            editObj.platformOptions = [{value: "ALL", text: "ALL"}, {value: "ANDROID", text: "ANDROID"}, {
                value: "IOS",
                text: "IOS"
            }];
            if (editObj.platform == '') {
                editObj.platform = "ALL";
            }
            editObj.targetTypeOptions = [
                {value: "ALL", text: "全部"},
                {value: "ALIAS", text: "别名"},
                {value: "TAG", text: "标签"},
                {value: "EXCEL", text: "EXCEL"}
            ];
            if (editObj.targetType == '') {
                editObj.targetType = "ALL";
                editObj.targetValue = "ALL";
            }
            editObj.excelPath = editObj.targetValue;
            console.log(editObj.targetValue);
            editObj.msgTypeOptions = [{value: "N", text: "通知"}]
            if (editObj.msgType == '') {
                editObj.msgType = "N";
            }

        },
        beforeSave: function (editObj) {
            if (editObj.targetType == 'EXCEL') {
                editObj.targetValue = editObj.excelPath;
            }
        }
    });
    $scope.pushUc.query();
    $scope.pushUc.searchForm.platform = '';
    $scope.pushUc.searchForm.platformOptions = [
        {value: '', text: '全部'},
        {value: 'ALL', text: 'ALL'},
        {value: 'IOS', text: 'IOS'},
        {value: 'ANDROID', text: 'ANDROID'},
        {value: 'EXCEL', text: 'EXCEL'}
    ];
    $scope.pushUc.searchForm.sourceTypeOptions = [
        {value: "", text: "全部"},
        {value: "1", text: "明星圈子"},
        {value: "2", text: "星战"},
        {value: "3", text: "资讯"},
        {value: "4", text: "排行榜"},
        {value: "5", text: "投票"},
        {value: "6", text: "商城"},
        {value: "7", text: "密卷"},
        {value: "8", text: "系统"},
        {value: "9", text: "问答"},
        {value: "10", text: "充值"},
        {value: "11", text: "行程"},
        {value: "12", text: "专题"},
        {value: "13", text: "活动"},
        {value: "14", text: "网页"}

    ];
    $scope.pushUc.searchForm.sourceType = "";
    $scope.pushUc.searchForm.msgTypeOptions = [
        {value: "", text: "全部"},
        {value: "N", text: "通知"}
    ];
    $scope.pushUc.searchForm.msgType = "";
    $scope.pushUc.searchForm.statusOptions = [
        {value: "", text: "全部"},
        {value: "1", text: "待发送"},
        {value: "2", text: "发送中"},
        {value: "3", text: "已发送"},
        {value: "4", text: "发送失败"}
    ];
    $scope.pushUc.searchForm.status = "";

    var userUc = UC.create({
        idAttribute: 'userId',
        scope: $scope,
        autoSelect: true,
        urlBase: '/push',
        queryUrl: '/push/user/page',
        fields: [
            {name: 'userId', displayName: '用户ID', searchable: true, width: 200},
            {name: 'realname', displayName: '用户名称', searchable: true, width: 250}
        ]
    });

    var tagUc = UC.create({
        idAttribute: 'id',
        scope: $scope,
        autoSelect: true,
        urlBase: '/push',
        queryUrl: '/push/sys/tags',
        fields: [
            {
                name: 'id', displayName: 'ID', editable: false, inputType: 'text', width: 100
            },
            {
                name: 'name', displayName: 'Tag名称', editable: true,inputType: 'text', width: 150
            },
            {
                name: 'remark', displayName: '备注', editable: true, searchable: true, inputType: 'text', width: 250
            }
        ]
    });
    $scope.pushUc.selectTarget = function (editObj) {
        editObj.targetValue = "";
        if (editObj.targetType == 'ALL') {
            editObj.targetValue = 'ALL';
            return;
        }
        if (editObj.targetType == 'ALIAS') {
            $modal.open({
                templateUrl: 'userList.html',
                controller: function ($scope, $modalInstance) {
                    $scope.uc = userUc;
                    $scope.uc.scope = $scope;
                    $scope.uc.query();
                    $scope.selectUser = function () {
                        var selections = $scope.uc.selection();
                        if (selections != undefined) {
                            editObj.targetValue = '';
                            $.each(selections, function (i, v) {
                                editObj.targetValue = editObj.targetValue + v.userId + ",";
                            })
                        }
                        $modalInstance.close();
                    }
                    $scope.cancel = function () {
                        $modalInstance.close();
                    }
                }
            });
            return;
        }
        if (editObj.targetType == 'TAG') {
            $modal.open({
                templateUrl: 'userList.html',
                controller: function ($scope, $modalInstance) {
                    $scope.uc = tagUc;
                    $scope.uc.scope = $scope;
                    $scope.uc.query();
                    $scope.selectUser = function () {
                        var selecteds = $scope.uc.selection();
                        if (selecteds) {
                            editObj.targetValue = '';
                            $.each(selecteds, function (i, v) {
                                editObj.targetValue = editObj.targetValue + v.name + ",";
                            });
                        }
                        $modalInstance.close();
                    }
                    $scope.cancel = function () {
                        $modalInstance.close();
                    }
                }
            });
            return;
        }
    }

}]);

App.filter('msgTypeFilter', function () {
    return function (text) {
        if (text == 'M') {
            return "消息";
        }
        if (text == 'N') {
            return "通知";
        }
        if (text == 'S') {
            return "短信";
        }
        return "未知";
    }
});

App.filter('msgStatusFilter', function () {
    return function (text) {
        switch (text) {
            case 1 :
                return "待发送";
            case 2 :
                return "发送中";
            case 3 :
                return "已发送";
            case 4 :
                return "发送失败";
        }

    }
});

App.filter('msgSourceTypeFilter', function () {
    return function (text) {
        switch (text) {
            case "1" :
                return "明星圈子";
                break;
            case "2" :
                return "星战";
                break;
            case "3" :
                return "资讯";
                break;
            case "4" :
                return "排行榜";
                break;
            case "5" :
                return "投票";
                break;
            case "6" :
                return "商城";
                break;
            case "7" :
                return "密卷";
                break;
            case "8" :
                return "系统";
                break;
            case "9" :
                return "问答";
                break;
            case "10" :
                return "充值";
                break;
            case "11" :
                return "行程";
                break;
            case  "12" :
                return "专题";
                break;
            case  "13" :
                return "活动";
                break;
            case "14" :
                return "网页";
                break;
            default :
                return "系统";
                break;
        }
    }
})