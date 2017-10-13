/**=========================================================
 * Handle sidebar collapsible elements
 =========================================================*/
App.controller('SidebarController', ['$rootScope', '$scope', '$state', 'Http', '$timeout', 'Utils',
    function($rootScope, $scope, $state, Http, $timeout, Utils){

        $scope.userBlockVisible = true;

        $scope.$on('toggleUserBlock', function(event, args) {
            $scope.userBlockVisible = ! $scope.userBlockVisible;
        });
        var collapseList = [];

        $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
            if ( newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        // Check item and children active state
        var isActive = function(item) {
            if(!item) return;
            if( !item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value, key) {
                    if(isActive(value)) foundActive = true;
                });
                return foundActive;
            }else{
                return $state.is(item.sref) || $state.includes(item.sref);
            }
        };

        $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') + (isActive(item) ? ' active' : '') ;
        };

        /**
         * 从服务端加载菜单
         */
        $scope.loadSidebarMenu = function() {
            // Http.get("/security/menu/list", {app: 'security'}, function(result){
            //     $scope.menuItems = result.datas;
            // });
            $scope.menuItems = [
                {
                    "anchor" : "app.push",
                    "icon" : "icon-user",
                    "name" : "推送列表"
                }
            ]
        };

        $scope.loadSidebarMenu();

        $scope.addCollapse = function($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function($index, isParentItem) {
            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;
            if( angular.isDefined( collapseList[$index] ) ) {
                if ( ! $scope.lastEventFromChild ) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            }
            else if ( isParentItem ) {
                closeAllBut(-1);
            }
            $scope.lastEventFromChild = isChild($index);
            return true;
        };

        function closeAllBut(index) {
            index += '';
            for(var i in collapseList) {
                if(index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }
}]);