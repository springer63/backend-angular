if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

// APP START
var App = angular.module('angle', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'tmh.dynamicLocale',
    'ui.utils'
]);

App.run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache', '$timeout', function ($rootScope, $state, $stateParams, $window, $templateCache, $timeout) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;
    $rootScope.$timeout = $timeout;

    // Scope Globals
    $rootScope.app = {
        name: '火星圈',
        description: '系统管理后台',
        year: ((new Date()).getFullYear()),
        layout: {
            isFixed: true,
            isCollapsed: false,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: "app/css/theme-g.css"
        },
        useFullLayout: false,
        hiddenFooter: false,
        viewAnimation: 'ng-fadeInUp'
    };
    $rootScope.user = {
        name:     'John',
        picture:  'app/img/user/02.jpg'
    };
}]);

/**=========================================================
 * App routes and resources configuration
 =========================================================*/
App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';
        $locationProvider.html5Mode(false);
        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'MainController',
                resolve: helper.resolveFor('ui.grid', 'fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'datetimepicker',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'ngDialog', 'MainController', 'SidebarController')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: helper.basepath('dashboard.html')
            })
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ["$rootScope", function($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html',
                resolve: helper.resolveFor('LoginFormController')
            })
            .state('page.lock', {
                url: '/lock',
                title: "Lock",
                templateUrl: 'app/pages/lock.html'
            });

    }]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';
    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
    });
}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
        'use strict';
        // registering components after bootstrap
        App.controller = $controllerProvider.register;
        App.directive  = $compileProvider.directive;
        App.filter     = $filterProvider.register;
        App.factory    = $provide.factory;
        App.service    = $provide.service;
        App.constant   = $provide.constant;
        App.value      = $provide.value;
    }]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

    tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
    //tmhDynamicLocaleProvider.useStorage('$cookieStore');

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {
    $tooltipProvider.options({appendToBody: true});
}]);

/**=========================================================
 * Define constants to inject across the application
 =========================================================*/
App
    .constant('APP_COLORS', {
        'primary':                '#5d9cec',
        'success':                '#27c24c',
        'info':                   '#23b7e5',
        'warning':                '#ff902b',
        'danger':                 '#f05050',
        'inverse':                '#131e26',
        'green':                  '#37bc9b',
        'pink':                   '#f532e5',
        'purple':                 '#7266ba',
        'dark':                   '#3a3f51',
        'yellow':                 '#fad732',
        'gray-darker':            '#232735',
        'gray-dark':              '#3a3f51',
        'gray':                   '#dde6e9',
        'gray-light':             '#e4eaec',
        'gray-lighter':           '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG':             1200,
        'desktop':                992,
        'tablet':                 768,
        'mobile':                 480
    })
    .constant('APP_REQUIRES', {
        // jQuery based and standalone scripts
        scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            'modernizr':          ['vendor/modernizr/modernizr.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'icons':              ['vendor/skycons/skycons.js',
                'vendor/fontawesome/css/font-awesome.min.css',
                'vendor/simple-line-icons/css/simple-line-icons.css',
                'vendor/weather-icons/css/weather-icons.min.css'],
            'sparklines':         ['vendor/sparklines/jquery.sparkline.min.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['vendor/gmap/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                'vendor/Flot/jquery.flot.resize.js',
                'vendor/Flot/jquery.flot.pie.js',
                'vendor/Flot/jquery.flot.time.js',
                'vendor/Flot/jquery.flot.categories.js',
                'vendor/flot-spline/js/jquery.flot.spline.min.js'],
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                'vendor/jquery-ui/ui/widget.js'],
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                'vendor/jquery-ui/ui/widget.js',
                'vendor/jquery-ui/ui/mouse.js',
                'vendor/jquery-ui/ui/draggable.js',
                'vendor/jquery-ui/ui/droppable.js',
                'vendor/jquery-ui/ui/sortable.js',
                'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                'vendor/codemirror/lib/codemirror.css'],
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                'vendor/codemirror/mode/xml/xml.js',
                'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/dist/parsley.min.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                'vendor/morris.js/morris.js',
                'vendor/morris.js/morris.css'],
            'loaders.css':        ['vendor/loaders.css/loaders.css'],
            'datetimepicker':     ['vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css'],
            'spinkit':            ['vendor/spinkit/css/spinkit.css']
        },
        modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                'vendor/chosen_v1.2.0/chosen.min.css',
                'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                'vendor/ngDialog/css/ngDialog.min.css',
                'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},
            {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.tree',                   files: ['vendor/angular-ui-tree/angular-ui-tree.min.js',
                'vendor/angular-ui-tree/angular-ui-tree.min.css']},
            {name: 'ui.select.tree',            files: ['vendor/angular-multi-select/isteven-multi-select.js',
                'vendor/angular-multi-select/isteven-multi-select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'ngGrid',                    files: ['vendor/ng-grid/build/ng-grid.min.js',
                'vendor/ng-grid/ng-grid.css' ]},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                'vendor/angular-ui-grid/ui-grid.js']},
            {name: 'textAngularSetup',          files: ['vendor/textAngular/src/textAngularSetup.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular-rangy.min.js',
                'vendor/textAngular/src/textAngular.js',
                'vendor/textAngular/src/textAngularSetup.js',
                'vendor/textAngular/src/textAngular.css'], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                'vendor/rickshaw/rickshaw.js',
                'vendor/rickshaw/rickshaw.min.css',
                'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                'vendor/chartist/dist/chartist.js',
                'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                'vendor/datatables/media/js/jquery.dataTables.js',
                'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},
            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                'vendor/jqcloud2/dist/jqcloud.js',
                'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/angular-grid.css',
                'vendor/ag-grid/dist/angular-grid.js',
                'vendor/ag-grid/dist/theme-dark.css',
                'vendor/ag-grid/dist/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']}
        ]
    })
;

App.directive('loadCss', function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function (e) {
                if(element.is('a')) e.preventDefault();
                var uri = attrs.loadCss,
                    link;
                if(uri) {
                    link = createLink(uri);
                    if ( !link ) {
                        $.error('Error creating stylesheet link element.');
                    }
                }
                else {
                    $.error('No stylesheet location defined.');
                }
            });
        }
    };

    function createLink(uri) {
        var linkId = 'autoloaded-stylesheet',
            oldLink = $('#'+linkId).attr('id', linkId + '-old');

        $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
        }));

        if( oldLink.length ) {
            oldLink.remove();
        }

        return $('#'+linkId);
    }


});
/**=========================================================
 * Initializes the masked inputs
 =========================================================*/

App.directive('masked', function() {
    return {
        restrict: 'A',
        controller: ["$scope", "$element", function($scope, $element) {
            var $elem = $($element);
            if($.fn.inputmask)
                $elem.inputmask();
        }]
    };
});

/**=========================================================
 * AngularJS Directives for Morris Charts
 =========================================================*/
(function() {
    "use strict";

    App.directive('morrisBar',   morrisChart('Bar')   );
    App.directive('morrisDonut', morrisChart('Donut') );
    App.directive('morrisLine',  morrisChart('Line')  );
    App.directive('morrisArea',  morrisChart('Area')  );

    function morrisChart(type) {
        return function () {
            return {
                restrict: 'EA',
                scope: {
                    morrisData: '=',
                    morrisOptions: '='
                },
                link: function($scope, elem, attrs) {
                    // start ready to watch for changes in data
                    $scope.$watch("morrisData", function(newVal, oldVal) {
                        if (newVal) {
                            $scope.morrisInstance.setData(newVal);
                            $scope.morrisInstance.redraw();
                        }
                    }, true);
                    // the element that contains the chart
                    $scope.morrisOptions.element = elem;
                    // If data defined copy to options
                    if($scope.morrisData)
                        $scope.morrisOptions.data = $scope.morrisData;
                    // Init chart
                    $scope.morrisInstance = new Morris[type]($scope.morrisOptions);

                }
            }
        }
    }

})();

/**=========================================================
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/
App.directive('searchOpen', ['navSearch', function(navSearch) {
    'use strict';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function($scope, $element) {
            $element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click', navSearch.toggle);
        }]
    };

}]).directive('searchDismiss', ['navSearch', function(navSearch) {
    'use strict';

    var inputSelector = '.navbar-form input[type="text"]';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function($scope, $element) {

            $(inputSelector)
                .on('click', function (e) { e.stopPropagation(); })
                .on('keyup', function(e) {
                    if (e.keyCode == 27) // ESC
                        navSearch.dismiss();
                });

            // click anywhere closes the search
            $(document).on('click', navSearch.dismiss);
            // dismissable options
            $element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click', navSearch.dismiss);
        }]
    };

}]);

App.directive("now", ['dateFilter', '$interval', function(dateFilter, $interval){
    return {
        restrict: 'E',
        link: function(scope, element, attrs){

            var format = attrs.format;

            function updateTime() {
                var dt = dateFilter(new Date(), format);
                element.text(dt);
            }

            updateTime();
            $interval(updateTime, 1000);
        }
    };
}]);

/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/
App.directive('panelDismiss', ["$q", "Utils", function($q, Utils){
    'use strict';
    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {
            var removeEvent   = 'panel-remove',
                removedEvent  = 'panel-removed';

            $element.on('click', function () {

                // find the first parent panel
                var parent = $(this).closest('.panel');

                removeElement();

                function removeElement() {
                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    // Communicate event destroying panel
                    $scope.$emit(removeEvent, parent.attr('id'), deferred);
                    promise.then(destroyMiddleware);
                }

                // Run the animation before destroy the panel
                function destroyMiddleware() {
                    if(Utils.support.animation) {
                        parent.animo({animation: 'bounceOut'}, destroyPanel);
                    }
                    else destroyPanel();
                }

                function destroyPanel() {

                    var col = parent.parent();
                    parent.remove();
                    // remove the parent if it is a row and is empty and not a sortable (portlet)
                    col
                        .filter(function() {
                            var el = $(this);
                            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                        }).remove();

                    // Communicate event destroyed panel
                    $scope.$emit(removedEvent, parent.attr('id'));

                }
            });
        }]
    };
}])
/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
    .directive('panelCollapse', ['$timeout', function($timeout){
        'use strict';

        var storageKeyName = 'panelState',
            storage;

        return {
            restrict: 'A',
            scope: false,
            controller: ["$scope", "$element", function ($scope, $element) {

                // Prepare the panel to be collapsible
                var $elem   = $($element),
                    parent  = $elem.closest('.panel'), // find the first parent panel
                    panelId = parent.attr('id');

                storage = $scope.$storage;

                // Load the saved state if exists
                var currentState = loadPanelState( panelId );
                if ( typeof currentState !== 'undefined') {
                    $timeout(function(){
                            $scope[panelId] = currentState; },
                        10);
                }

                // bind events to switch icons
                $element.bind('click', function() {

                    savePanelState( panelId, !$scope[panelId] );

                });
            }]
        };

        function savePanelState(id, state) {
            if(!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if(!data) { data = {}; }
            data[id] = state;
            storage[storageKeyName] = angular.toJson(data);
        }

        function loadPanelState(id) {
            if(!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if(data) {
                return data[id];
            }
        }

    }])
    /**=========================================================
     * Refresh panels
     * [panel-refresh] * [data-spinner="standard"]
     =========================================================*/
    .directive('panelRefresh', ["$q", function($q){
        'use strict';

        return {
            restrict: 'A',
            scope: false,
            controller: ["$scope", "$element", function ($scope, $element) {

                var refreshEvent   = 'panel-refresh',
                    whirlClass     = 'whirl',
                    defaultSpinner = 'standard';


                // catch clicks to toggle panel refresh
                $element.on('click', function () {
                    var $this   = $(this),
                        panel   = $this.parents('.panel').eq(0),
                        spinner = $this.data('spinner') || defaultSpinner
                    ;

                    // start showing the spinner
                    panel.addClass(whirlClass + ' ' + spinner);

                    // Emit event when refresh clicked
                    $scope.$emit(refreshEvent, panel.attr('id'));

                });

                // listen to remove spinner
                $scope.$on('removeSpinner', removeSpinner);

                // method to clear the spinner when done
                function removeSpinner (ev, id) {
                    if (!id) return;
                    var newid = id.charAt(0) == '#' ? id : ('#'+id);
                    angular
                        .element(newid)
                        .removeClass(whirlClass);
                }
            }]
        };
    }]);



App.directive('skycon', function(){

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var skycons = new Skycons({'color': (attrs.color || 'white')});

            element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');

            skycons.add(element.children()[0], attrs.skycon);

            skycons.play();

        }
    };
});


/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/

App.directive('checkAll', function() {
    'use strict';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function($scope, $element){

            $element.on('change', function() {
                var $this = $(this),
                    index= $this.index() + 1,
                    checkbox = $this.find('input[type="checkbox"]'),
                    table = $this.parents('table');
                // Make sure to affect only the correct checkbox column
                table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
                    .prop('checked', checkbox[0].checked);

            });
        }]
    };

});
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

App.directive('tagsinput', ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

            element.on('itemAdded itemRemoved', function(){
                // check if mvvm.js value is not empty and is a string
                // and update the mvvm.js from string to an array of tags
                if(ngModel.$viewValue && ngModel.$viewValue.split) {
                    ngModel.$setViewValue( ngModel.$viewValue.split(',') );
                    ngModel.$render();
                }
            });

            $timeout(function(){
                element.tagsinput();
            });

        }
    };
}]);

/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that
 * affects globally the entire layout or more than one item
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function(toggle) {
    'use strict';

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var $body = $('body');

            $(element)
                .on('click', function (e) {
                    e.preventDefault();
                    var classname = attrs.toggleState;

                    if(classname) {
                        if( $body.hasClass(classname) ) {
                            $body.removeClass(classname);
                            if( ! attrs.noPersist)
                                toggle.removeState(classname);
                        }
                        else {
                            $body.addClass(classname);
                            if( ! attrs.noPersist)
                                toggle.addState(classname);
                        }

                    }

                });
        }
    };

}]);

/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/

App.directive("triggerResize", ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function(){
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'))
                });
            });
        }
    };
}]);

/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

App.directive('validateForm', function() {
    return {
        restrict: 'A',
        controller: ["$scope", "$element", function($scope, $element) {
            var $elem = $($element);
            if($.fn.parsley)
                $elem.parsley();
        }]
    };
});

App.directive('datetimepicker',function(){
    return {
        restrict: 'A',
        scope : {
            model : '=ngModel'
        },
        link: function (scope, element, attr) {
            $.fn.datetimepicker.dates['zh-CN'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                today: "今天",
                suffix: [],
                meridiem: ["上午", "下午"]
            };
            $.fn.datetimepicker.defaults.language = "zh-CN";
            element.datetimepicker({
                format : attr.format || 'yyyy-MM-dd HH:mm:ss',
                minView : attr.minview || 0,
                startView: attr.startView || 2,
                todayBtn: true,
                autoclose : true
            }).on('changeDate', function(e) {
                scope.model = element.val();
            });
        }
    };
});

/**=========================================================
 * Browser detection
 =========================================================*/
App.service('browser', function(){
    "use strict";

    var matched, browser;

    var uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
            /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        var platform_match = /(ipad)/.exec( ua ) ||
            /(iphone)/.exec( ua ) ||
            /(android)/.exec( ua ) ||
            /(windows phone)/.exec( ua ) ||
            /(win)/.exec( ua ) ||
            /(mac)/.exec( ua ) ||
            /(linux)/.exec( ua ) ||
            /(cros)/i.exec( ua ) ||
            [];

        return {
            browser: match[ 3 ] || match[ 1 ] || "",
            version: match[ 2 ] || "0",
            platform: platform_match[ 0 ] || ""
        };
    };

    matched = uaMatch( window.navigator.userAgent );
    browser = {};

    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if ( matched.platform ) {
        browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if ( browser.rv )
    {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr )
    {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android )
    {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    return browser;

});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function(colors) {

    return {
        byName: function(name) {
            return (colors[name] || '#fff');
        }
    };

}]);

/**=========================================================
 * Services to share navbar search functions
 =========================================================*/
App.service('navSearch', function() {
    var navbarFormSelector = 'form.navbar-form';
    return {
        toggle: function() {

            var navbarForm = $(navbarFormSelector);

            navbarForm.toggleClass('open');

            var isOpen = navbarForm.hasClass('open');

            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

        },

        dismiss: function() {
            $(navbarFormSelector)
                .removeClass('open')      // Close control
                .find('input[type="text"]').blur() // remove focus
                .val('')                    // Empty input
            ;
        }
    };

});
/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

App.service('Notify', ["$timeout", function($timeout){
    this.alert = alert;

    ////////////////

    function alert(msg, opts) {
        if ( msg ) {
            $timeout(function(){
                $.notify(msg, opts || {});
            });
        }
    }

}]);



/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function($, window, document){

    var containers = {},
        messages   = {},

        notify     =  function(options){

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            if(group) {
                for(var id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,
        show: function() {
            if (this.element.is(":visible")) return;
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);
            this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){
                if ($this.options.timeout) {
                    var closefn = function(){ $this.close(); };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }
            });
            return this;
        },
        close: function(instantly) {
            var $this    = this,
                finalize = function(){
                    $this.element.remove();
                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if(this.timeout) clearTimeout(this.timeout);
            if(instantly) {
                finalize();
            } else {
                this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){
                    finalize();
                });
            }
        },
        content: function(html){
            var container = this.element.find(">div");
            if(!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function(status) {
            if(!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);
            this.currentstatus = status;
            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };

    $["notify"]          = notify;
    $["notify"].message  = Message;
    $["notify"].closeAll = closeAll;
    return notify;
}(jQuery, window, document));

/**=========================================================
 * Provides helper functions for routes definition
 =========================================================*/
App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";

    // Set here the base of the relative path
    // for all app views
    this.basepath = function (uri) {
        return 'app/views/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise
                for(var i=0, len=_args.length; i < len; i ++){
                    promise = andThen(_args[i]);
                }
                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if(typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function() {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            // finally, return a promise
                            return $ocLL.load( whatToLoad );
                        });
                }
                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)
                function getRequired(name) {
                    if (appRequires.modules){
                        for(var m in appRequires.modules)
                            if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    }
                    if(appRequires.scripts && appRequires.scripts[name]){
                        return appRequires.scripts && appRequires.scripts[name];
                    }
                    return ['app/js/controller/' + name + '.js'];
                }

            }]};
    }; // resolveFor

    this.$get = function(){
        return {
            basepath: this.basepath
        }
    };

}]);


/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function($rootScope) {

    var storageKeyName  = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function(classname){
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);
            if(!data)  {
                data = classname;
            }
            else {
                data = WordChecker.addWord(data, classname);
            }
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },
        // Remove a state from the browser storage
        removeState: function(classname){
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if(!data) return;
            data = WordChecker.removeWord(data, classname);
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },
        // Load the state string and restore the classlist
        restoreState: function($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);
            // nothing to restore
            if(!data) return;
            $elem.addClass(data);
        }

    };

}]);
/**=========================================================
 * Utility library to use across the theme
 =========================================================*/
App.service('Utils', ["$window", "APP_MEDIAQUERY", function($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win  = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function() {
                var transitionEnd = (function() {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && { end: transitionEnd };
            })(),
            animation: (function() {

                var animationEnd = (function() {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(callback){ window.setTimeout(callback, 1000/60); },
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function(element, options) {

            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top  = $win.scrollTop(),
                offset      = $element.offset(),
                left        = offset.left,
                top         = offset.top;

            options = $.extend({topoffset:0, leftoffset:0}, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);
/**=========================================================
 * Module: vector-map.js
 * Services to initialize vector map plugin
 =========================================================*/

App.service('vectorMap', function() {
    'use strict';
    return {
        init: function($element, opts, series, markers) {
            $element.vectorMap({
                map:             opts.mapName,
                backgroundColor: opts.bgColor,
                zoomMin:         1,
                zoomMax:         8,
                zoomOnScroll:    false,
                regionStyle: {
                    initial: {
                        'fill':           opts.regionFill,
                        'fill-opacity':   1,
                        'stroke':         'none',
                        'stroke-width':   1.5,
                        'stroke-opacity': 1
                    },
                    hover: {
                        'fill-opacity': 0.8
                    },
                    selected: {
                        fill: 'blue'
                    },
                    selectedHover: {
                    }
                },
                focusOn:{ x:0.4, y:0.6, scale: opts.scale},
                markerStyle: {
                    initial: {
                        fill: opts.markerColor,
                        stroke: opts.markerColor
                    }
                },
                onRegionLabelShow: function(e, el, code) {
                    if ( series && series[code] )
                        el.html(el.html() + ': ' + series[code] + ' visitors');
                },
                markers: markers,
                series: {
                    regions: [{
                        values: series,
                        scale: opts.scaleColors,
                        normalizeFunction: 'polynomial'
                    }]
                },
            });
        }
    };
});

/**
 * 辅助服务
 */
App.factory('Util',["$q", "ngDialog", function($q, ngDialog){
    return new function(){
        /**
         * 确认信息
         * @param message 消息
         * @param callback 确认回调函数
         */
        this.confirm = function(message, callback){
            ngDialog.openConfirm({
                template:
                '<p>' + message + '</p>' +
                '<div>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">取消' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)">确定' +
                '</button></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                console.log('Modal promise resolved. Value: ', value);
                callback();
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        /**
         *  显示加载中
         */
        this.showLoading = function(container){
            if(!container){
                container = $('body');
            }
            $('<div class="js-loading loading"><div class="loading-inner"></div></div>').appendTo(container);
        }
        /**
         * 隐藏加载中
         */
        this.hideLoading = function(container){
            if(!container){
                container = $('body');
            }
            $(container).find('.js-loading').remove();
        }
        this.formatDate = function(date, fmt){
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
}]);
/**
 * 页面提示
 */
App.factory('PageTips',function(){
    return new function(){
        //显示提示
        this.show = function(message , style){
            if(!message){
                message = style == 'success' ? '操作成功' : '操作失败';
            }
            $('<div class="page_tips '+ style +'">\
				<div class="inner">'+ message +'</div>\
				</div>').appendTo('body').fadeOut(6000);
        }
        //页面提示成功
        this.success = function(message){
            this.show(message , 'success');
        }
        //页面提示错误
        this.error = function(message){
            this.show(message , 'error');
        }
    }
});
/**
 * 网络请求服务
 * @see $http angular网络基础服务
 * @see PageTips 页面提示服务
 */
App.factory('Http',function($http, $state, PageTips){
    return new function(){
        /**
         * 结果处理器
         */
        var HttpResultHandle = function(successCallback , errorCallback){
            /**
             * 成功处理
             */
            this.successHandle  = function(result , status , respHeaders){
                if(result.code !== '0'){
                    if(result.code == '97'){
                        $state.go('page.login');
                    }
                    if(errorCallback){
                        errorCallback(result);
                    }else{
                        PageTips.error(result.message);
                    }
                }else{
                    successCallback && successCallback(result);
                }
            }
            /**
             * 错误处理
             */
            this.errorHandle  = function(err){
                errorCallback && errorCallback(err);
                if(!errorCallback) {
                    PageTips.error(err.message);
                }
            }
        }
        /**
         * 获取SON
         * @param url 请求地址
         * @param data json对象，可为空
         * @param success 成功回调函数
         * @param error 错误回调函数
         */
        this.get = function(url, data, success, error){
            if(url.indexOf('?') == -1){
                url =  url + '?' + $.param(data);
            }else{
                url =  url + '&' + $.param(data);
            }
            var resultHandle = new HttpResultHandle(success,error);
            $http.get(url).success(resultHandle.successHandle).error(resultHandle.errorHandle);
        }
        /**
         * 上传文件
         * @param formData 表单数据
         * @param success 成功回调
         * @param error 错误回调
         */
        this.upload = function(formData, success, error){
            var resultHandle = new HttpResultHandle(success,error);
            var url = 'https://dev.hxquan.cn/api/upload/file';
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.onload = function(event) {
                if (xhr.status === 200) {
                    var result = JSON.parse(xhr.responseText);
                    resultHandle.successHandle(result);
                } else {
                    resultHandle.errorHandle();
                }
            };
            xhr.send(formData);
        }
        /**
         * 提交JSON
         * @param url 请求地址
         * @param data json对象，可为空
         * @param success 成功回调函数
         * @param error 错误回调函数
         */
        this.post = function(url, data , success , error){
            var resultHandle = new HttpResultHandle(success,error);
            $http.post(url, data).success(resultHandle.successHandle).error(resultHandle.errorHandle);
        }

    }
});
/**
 * 表单服务
 */
App.factory('Form', function(PageTips){
    return new function(){
        /**
         * 重置样式
         */
        this.reset = function(form){
            if(!form) return;
            var formEl = $('form[name="'+ form.$name +'"]');
            formEl.find('.form-group has-error .form-control-feedback').remove();
            formEl.find('.form-group has-error .help-block').remove();
            formEl.find('.form-group').removeClass('has-error');
        }
        /**
         * 验证表单
         * @param form angular表单对象
         */
        this.validate = function(form){
            this.reset(form);
            if(!form) return true;
            if(!form.$invalid){
                return true;
            }
            //设置错误
            var setError = function(name , message){
                if(!name) {
                    PageTips.error(message);
                    return;
                }
                var formEl = $('form[name="'+ form.$name +'"]');
                var input = formEl.find('[name="'+ name +'"]');
                input.parents('.form-group').addClass('has-error');
                $('<small class="help-block error">'+ message +'</small>').insertAfter(input);
                $('<i class="form-control-feedback glyphicon glyphicon-remove"></i>').insertAfter(input);
            }
            var requireds = form.$error.required;
            if(requireds){
                for(var i = 0; i < requireds.length; i++){
                    var required = requireds[i];
                    var name = required.$name;
                    setError(name , '必须填写');
                }
            }
            var patterns = form.$error.pattern;
            if(patterns){
                for(var i = 0; i < patterns.length; i++){
                    var pattern = patterns[i];
                    var name = pattern.$name;
                    setError(name , '格式错误');
                }
            }
            return false;
        }
    }
});

/**
 * 时间格式化指令
 */
App.directive('dateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            function formatter(value) {
                if(value) return dateFilter(value, attrs.dateFormat);
            }
            function parser() {
                return ctrl.$modelValue || ctrl.$viewValue;
            }
            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);
            element.on('change', function (e) {
                ctrl.$modelValue = ctrl.$viewValue;
                element.value = ctrl.$modelValue;
            });

        }
    };
}]);

/**
 * 表单生成指令
 */
App.directive('ngFields', function($compile) {
    return {
        restrict: 'EA',
        scope : {
            'fields': '=ngFields',
            'model': "=ngModel",
            'uc': "=ngUc"
        },
        transclude: false,
        link: function (scope, element, attr) {
            var child = element.children('div');
            if(!scope.fields){
                return;
            }
            scope.fields.forEach(function(f) {
                var temp = $(child[0]).clone();
                temp.find('label').text(f.displayName);
                if(f.ngShow){
                    temp.attr({'ng-show': f.ngShow});
                }
                switch (f.inputType){
                    case 'text':
                        var attrs = {'ng-model': 'model.' + f.name, 'type': 'text', 'name': f.name};
                        temp.find('input').attr(angular.extend(attrs, f.attrs || {}));
                        break;
                    case 'number':
                        var attrs = {'ng-model': 'model.' + f.name, 'tpye': 'number', 'name': f.name};
                        temp.find('input').attr(angular.extend(attrs, f.attrs || {}));
                        break;
                    case 'date':
                        var attrs = {'ng-model': 'model.' + f.name, 'tpye': 'text','format':'yyyy-mm-dd', 'datetimepicker':'', 'date-format': 'yyyy-MM-dd', 'minView': '2', 'name': f.name};
                        temp.find('input').attr(angular.extend(attrs, f.attrs || {}));
                        break;
                    case 'datetime':
                        var attrs = {'ng-model': 'model.' + f.name, 'tpye': 'text','format':'yyyy-mm-dd hh:ii:ss', 'datetimepicker':'', 'date-format': 'yyyy-MM-dd HH:mm:ss', 'name': f.name};
                        temp.find('input').attr(angular.extend(attrs, f.attrs || {}));
                        break;
                    case 'html':
                        var $input = $('<div text-angular="" class="btn-group-small"></div>');
                        var attrs = {'ng-model': 'model.' + f.name, 'name': f.name};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        temp.find('input').replaceWith($input);
                        break;
                    case 'image':
                        var $input = $('<button ng-upload="" type="button" class=" btn btn-default"></button>');
                        var attrs = {'ng-model': 'model.' + f.name, 'name': f.name, value:"上传"};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        temp.find('input').replaceWith($input);
                        break;
                    case 'file':
                        var $input = $('<ng-file></ng-file>');
                        var attrs = {'ng-model': 'model.' + f.name, 'name': f.name};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        temp.find('input').replaceWith($input);
                        break;
                    case 'switch':
                        var $input = $('<label class="switch switch-lg" style="margin-top: 5px"><input type="checkbox"/><span></span></label>');
                        var attrs = {'ng-model': 'model.' + f.name, 'name': f.name, 'ng-checked': 'model.' + f.name};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        temp.find('input').replaceWith($input);
                        break;
                    case 'checkbox':
                        var $input = $('<label class="checkbox-inline c-checkbox"><input type="checkbox" value="{{x.value}}"/><span class="fa fa-check"></span>{{x.text}}</label>');
                        var attrs = {'ng-repeat': 'x in model.' + f.name + "Options"};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        $input.find('input').attr({name : f.name});
                        temp.find('input').replaceWith($input);
                        break;
                    case 'radio':
                        var $input = $('<label class="radio-inline c-radio"><input type="radio" ng-model="x.checked" value="{{x.value}}" ng-checked="x.checked"/><span class="fa fa-circle"></span >{{x.text}}</label>');
                        var attrs = {'ng-repeat': 'x in model.' + f.name + "Options"};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        $input.find('input').attr({name : f.name});
                        temp.find('input').replaceWith($input);
                        break;
                    case 'select':
                        var $input = $('<select chosen="" width="300px" class="chosen-select input-md form-control form-control-rounded"></select>');
                        var attrs = {'ng-options': 'x.value as x.text for x in model.' + f.name + "Options", 'ng-model': 'model.' + f.name};
                        $input.attr(angular.extend(attrs, f.attrs || {}));
                        $input.find('input').attr({name : f.name});
                        temp.find('input').replaceWith($input);
                        break;
                    default :
                        temp.find('input').attr({'ng-model': 'model.' + f.name, 'type': 'text', 'name': f.name});
                        break;
                }
                element.append(temp);
            });
            child.remove();
            var html = $compile(element.html())(scope);
            element.html(html);
        }
    }
});

App.directive('ucForm', function () {
    return {
        restrict: 'EA',
        scope : {
            'uc': "=ngModel"
        },
        transclude: false,
        templateUrl: 'app/views/template/edit-form.html',
        link: function (scope, element, attr) {
            //console.log("uc-form");
        }
    }
});

App.directive('searchForm', function () {
    return {
        restrict: 'EA',
        scope : {
            'uc': "=ngModel"
        },
        transclude: false,
        templateUrl: 'app/views/template/search-form.html',
        link: function (scope, element, attr) {
            console.log("uc-form");
        }
    }
});

/**
 * 图片上传指令
 */
App.directive('ngUpload',function(Http){
    return {
        restrict: 'EA',
        transclude: true,
        replace : true,
        require: "ngModel",
        scope : {
            'model' : '=ngModel'
        },
        template : '<div class="file-upload" ><div><img ng-src="{{model}}" style="height: 80px; width: auto; display: block;"/></div><div ng-transclude></div><input name="file" type="file"/></div>',
        link: function (scope, element) {
            var fileChanged = function(){
                var file = $(this);
                var parent  = file.parent();
                var form = $('<form enctype="multipart/form-data"></form>')
                form.append(file);
                var formData = new FormData(form.get(0));
                formData.append('catalog' , scope.model.catalog);
                Http.upload(formData , function(result){
                    scope.model = result.datas.url;
                    scope.$apply();
                });
                var html = file.prop('outerHTML');
                file.remove();
                file = $(html);
                file.change(fileChanged);
                parent.append(file);
            };
            element.find('input[type=file]').change(fileChanged);
        }
    };
});

/**
 * 文件上传指令
 */
App.directive('ngFile',function(Http){
    return {
        restrict: 'EA',
        replace : true,
        require:  'ngModel',
        scope : {
            'model' : '=ngModel'
        },
        template : '<div><input filestyle="" type="file" name="file" class="form-control" id="filestyle-1" tabindex="0" style="position: absolute; clip: rect(0px 0px 0px 0px);">' +
        '<div class="bootstrap-filestyle input-group"><input type="text" class="form-control" ng-model="model" disabled=""/>' +
        '<span class="group-span-filestyle input-group-btn" tabindex="0"><label for="filestyle-1" class="btn btn-default ">' +
        '<span class="icon-folder"></span>&nbsp;&nbsp; 选择文件</label></span></div></div>',
        link: function (scope, element) {
            var fileChanged = function(){
                var file = $(this).clone();
                var form = $('<form enctype="multipart/form-data"></form>')
                form.append(file);
                var formData = new FormData(form.get(0));
                formData.append('catalog', "upload");
                element.find('input[type=text]').val(file[0].files[0].name);
                Http.upload(formData , function(result){
                    scope.model = result.datas.url;
                    scope.$apply();
                });
            };
            element.find('input[type=file]').change(fileChanged);
        }
    };
});


App.factory('UC',function(Http , Util ,PageTips , Form){
    /**
     * 事件处理器
     */
    function registerEvents(target , eventNames){
        var events = {};
        for(var i = 0 ; i < eventNames.length; i++){
            events[eventNames[i]] = [];
        }
        target.events = events;
        target.on = function(event , callback){
            this.events[event].push(callback);
        }
        target.trigger = function(event , arguments){
            var callbacks = target.events[event];
            for(var i = 0; i < callbacks.length; i++){
                callbacks[i].apply(target , arguments);
            }
        }
    };
    /**
     * UI控制类
     */
    var UC = function(options){
        var self = this;
        this.scope = options.scope;
        this.editStatus = 0;
        this.queryResult = null;
        this.selectRows = [];
        this.fields = options.fields;
        this.searchFields = [];
        this.editFields = [];
        this.fields.forEach(function(e) {
            if(e.searchable){
                self.searchFields.push(e);
            }
            if(!e.sortable){
                e.enableSorting = false;
                e.enableColumnMenu = false
            }
            if(e.editable){
                self.editFields.push(e);
            }
        });
        this.gridOptions = {
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            paginationPageSizes: [10, 20, 50],
            paginationPageSize: 10,
            useCustomPagination: true,
            useExternalPagination: true,
            totalItems : 8, // 总数量
            paginationCurrentPage: 1, //当前的页码
            enableFooterTotalSelected: true, // 是否显示选中的总数,default为true,如果显示,showGridFooter 必须为true
            enableFullRowSelection : true, //是否点击行任意位置后选中,default为false,当为true时,checkbox可以显示但是不可选中
            enableRowHeaderSelection : true, //是否显示选中checkbox框 ,default为true
            enableRowSelection : true, // 行选择是否可用,default为true;
            enableSelectAll : true, // 选择所有checkbox是否可用，default为true;
            enableSelectionBatchEvent : true, //default为true
            modifierKeysToMultiSelect: false ,//default为false,为true时只能按ctrl或shift键进行多选,这个时候multiSelect必须为true;
            multiSelect: true ,// 是否可以选择多个,默认为true;
            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged(self.scope, function (pageNum, pageSize) {
                    self.gridOptions.data = self.query({page: pageNum - 1, count: pageSize});
                });
                self.gridApi.core.on.sortChanged(self.scope, function(grid, sortColumns){
                    if(sortColumns.length === 0){
                        return
                    }
                    self.gridOptions.data = self.query({orderBy: sortColumns[0].name + " " + sortColumns[0].sort.direction});
                });
                gridApi.selection.on.rowSelectionChanged(self.scope, function(row){
                    if(self.selectRows.length == 0 && row.isSelected){
                        self.selectRows.push(row.entity);
                        return;
                    }
                    if(row.isSelected){
                        for(var i = 0; i < self.selectRows.length; i++){
                            if(row.entity[self.idAttribute] == self.selectRows[i][self.idAttribute]){
                                return;
                            }
                        }
                        self.selectRows.push(row.entity);
                    }else{
                        for(var i = 0; i < self.selectRows.length; i++){
                            if(row.entity[self.idAttribute] == self.selectRows[i][self.idAttribute]){
                                self.selectRows.splice(i, 1);
                                return;
                            }
                        }
                    }
                });
            },
            columnDefs: this.fields
        };
        //注册事件
        registerEvents( this , [
            'afterQueryResultChanged',
            'beforeQuery',
            'afterQuery',
            'beforeEdit',
            'afterEdit',
            'endEdit',
            'beforeSave',
            'afterSave',
            'afterDelete',
            'afterSelect',
            'stepChanged'
        ]);
        /**
         * 默认值赋值
         */
        var defaults = {
            defaults : {},
            pageSize : 10,
            getUrl : options.urlBase + '/get',
            queryUrl : options.urlBase + '/page',
            addUrl : options.urlBase + '/add',
            updateUrl : options.urlBase + '/update',
            deleteUrl : options.urlBase + '/delete',
            filterQueryResult : null,
            cloneEditObject : true,
            fetchOnEdit : false,
            idAttribute : 'id',
            nameAttribute : 'name',
            filters : {},
            queryParams : {},
            searchForm : { searchText : '' },
            originalForm : { searchText : ''},
            insertRefresh : true,
            insertReverse : true,
            updateRefresh : false,
            deleteRefresh : false,
            autoSelect : false
        }
        for(var name in defaults){
            var value = options[name];
            this[name] = value == undefined ?  defaults[name] : value;
        }
        for(var name in this.events){
            var callName = name;
            var callback = options[callName];
            callback && this.on(name ,callback);
        }
        /**
         * 获取表格中被选中的项
         */
        this.selection = function () {
            //this.selectRows = this.gridApi.selection.getSelectedRows();
            return this.selectRows;
        }

        /**
         * 设置选中
         * @param object
         */
        this.selectRow = function(){
            this.selectRows.forEach(function(e){
                self.gridApi.selection.selectRow(e);
                self.gridOptions.data.forEach(function(row){
                    if(row[self.idAttribute] == e[self.idAttribute]){
                        self.gridApi.selection.selectRow(row);
                    }
                });
            });
        }
        /**
         * 重置
         */
        this.reset = function(){
            this.editStatus = 0;
            this.editObj = null;
            this.selectedObj = null;
            this.queryResult = null;
        }

        /**
         * 拷贝初始化的searchForm参数，用于reset
         */
        this.copyOriginalForm = function (){
            this.originalForm = angular.copy(this.searchForm);
        }

        /**
         * @param params 查询参数
         */
        this.query = function(params , callback){
            params = params || {};
            if(!params.page){
                this.gridOptions.paginationCurrentPage = 1;
            }
            this.selectedObj = null;
            Util.showLoading();
            params = $.extend(params, this.queryParams);
            var parameters = {};
            for (p in params){
                if(p.endsWith('Options') && params[p] instanceof Array){
                    continue;
                }
                parameters[p] =  params[p];
            }
            self.trigger('beforeQuery' , [parameters]);
            Http.get(this.queryUrl , parameters, function(result){
                Util.hideLoading();
                self.saveQueryParams = parameters;
                self.setQueryResult(result);
                self.trigger('afterQuery' , [result]);
                callback && callback(result);
            },function(result){
                Util.hideLoading();
                PageTips.error(result.message);
            });
        }
        /**
         * 查询
         * @param id 标识
         * @param success 成功回调
         */
        this.load = function(id , success){
            var params = {};
            params[this.idAttribute] = id;
            //提交地址给后台服务
            Util.showLoading();
            Http.get(this.getUrl , params, function(result){
                Util.hideLoading();
                success(result);
            },function(result){
                Util.hideLoading();
                PageTips.error(result.message);
            });
        }
        /**
         * 获取(刷新）对象信息
         * @param obj 对象，为空时用当前选择对象代替
         */
        this.fetch = function(obj , callback){
            var obj = obj || this.selectedObj;
            if(!obj) {
                return;
            }
            this.load(obj[this.idAttribute] , function(result){
                $.extend(obj , result);
                callback && callback(result);
            });
        }

        /**
         * 设置查询结果
         * @param result 结果
         */
        this.setQueryResult = function(result){
            this.queryResult = result;
            this.gridOptions.totalItems = result.datas.totalElements;
            this.gridOptions.data = result.datas.content;
            this.trigger('afterQueryResultChanged' , [result]);
            //是否自动选择
            if(this.autoSelect && result && result.datas.content.length > 0){
                this.scope.$parent.$timeout(function () {
                    self.selectRow();
                });
            }
        }

        /**
         * 获取对象
         * @param id 主键
         */
        this.get = function(id){
            if(!this.queryResult){
                return null;
            }
            for(var i = 0; i < this.queryResult.list.length; i++){
                var item = this.queryResult.list[i];
                if(item[this.idAttribute] == id){
                    return item;
                }
            }
            return null;
        }
        /**
         * 遍历数据([filter,]callback)
         * @param callback 回调
         * @param filterName 过滤器名称
         */
        this.each = function(callback, filterName){
            var collection = this.filter(filterName);
            if(!collection) return;
            for(var i = 0; i < collection.length; i++){
                var retval = callback(collection[i]);
                if(retval != undefined){
                    return retval;
                }
            }
        }

        /**
         * 搜索
         * @param params 搜索参数
         */
        this.search = function(params){
            this.saveQueryParams = {};
            this.query(this.searchForm);
        }

        /**
         * 重置表单
         * @param params
         */
        this.resetForm = function (params) {
            this.searchForm = angular.copy(this.originalForm);
        }

        /**
         * 查询
         * @param orderBy 查询条件
         */
        this.sort = function(orderBy){
            var params = this.saveQueryParams;
            params.currentPage = 0;
            params.orderBy = orderBy;
            this.query(params);
        }
        /**
         * 刷新数据
         */
        this.refresh = function(currentPage){
            var num = 0;
            if(currentPage && this.saveQueryParams){
                num = this.saveQueryParams.currentPage || 0;
            }
            this.changePage(num);
        }
        /**
         * 换页
         */
        this.changePage = function(num){
            var params = this.saveQueryParams;
            params.page = num;
            this.query(params);
        }
        /**
         * 选中记录
         * @param obj 对象
         */
        this.select = function(obj){
            this.selectedObj = obj;
            self.trigger('afterSelect' , [obj]);
        }
        /**
         * 添加记录
         * @param model 初始数据
         */
        this.add = function(model){
            if(window.event){
                window.event.stopPropagation();
            }
            var editObj = $.extend({} , this.defaults , model);
            self.trigger('beforeEdit' , [editObj , 1]);
            this.current = editObj;
            this.editObj = editObj;
            this.editStatus = 1;
            self.trigger('afterEdit' , [editObj , 1]);
        }
        /**
         * 编辑记录
         * @param obj 编辑记录
         * @param obj 编辑状态
         */
        this.edit = function(obj , editStatus){
            if(window.event){
                window.event.stopPropagation();
            }
            var callback = function(){
                var editObj;
                if(self.cloneEditObject){
                    editObj = $.extend({} , obj);
                }else{
                    editObj = obj;
                }
                self.current = obj;
                editStatus  = editStatus || 2;
                self.trigger('beforeEdit' , [editObj , editStatus]);
                self.editObj = editObj;
                self.editStatus = editStatus;
                self.trigger('afterEdit' , [editObj , editStatus]);
            }
            if(this.fetchOnEdit){
                this.fetch(obj , function(){
                    callback();
                });
            }else{
                callback();
            }
        }
        /**
         * 放弃编辑
         */
        this.cancel = function(form){
            this.editObj = null;
            this.editStatus = 0;
            Form.reset(form);
        }
        /**
         *  记录编辑
         */
        this.endEdit = function(result){
            var editStatus = this.editStatus;
            result = $.extend({} , result);
            delete result.code;
            delete result.message;
            $.extend(this.current, this.editObj , result);
            this.editObj = null;
            this.editStatus = 0;
            self.trigger('endEdit' , [this.current , editStatus]);
        }
        /**
         * 保存数据
         * @param form 表单
         * @param data 附加数据
         */
        this.save = function(form , data){
            if(form && !Form.validate(form)){
                return;
            }
            self.trigger('beforeSave' , [this.editObj]);
            Util.showLoading();
            //提交地址给后台服务
            var isNew =  this.editStatus == 1;
            var url = isNew ? this.addUrl : this.updateUrl;
            var params = $.extend(this.editObj , data);
            Http.post(url, params, function(result){
                Util.hideLoading();
                PageTips.success('保存成功');
                self.trigger('afterSave' , [result]);
                self.endEdit(result);
                //判断是否新增
                if(isNew){
                    if(self.insertRefresh){
                        self.refresh();
                    }else if(self.insertReverse){
                        self.insert(result , 0);
                    }else{
                        self.insert(result);
                    }
                }else if(self.updateRefresh){
                    self.refresh();
                }
            },function(result){
                Util.hideLoading();
                PageTips.error(result.message);
            });
        }
        /**
         * 插入记录
         * @param index 位置
         * @param obj 插入对象
         */
        this.insert = function(obj , index){
            if(!this.queryResult){
                return;
            }
            var list = this.queryResult.list;
            if(!list) list = this.queryResult;
            if(index == undefined){
                list.push(obj);
            }else{
                list.splice(index , 0 , obj);
            }
            this.trigger('afterQueryResultChanged' , [this.queryResult]);
        }
        /**
         * 移除记录
         * @param 移除对象
         */
        this.remove = function(obj){
            var list = this.queryResult.list;
            if(!list) list = this.queryResult;
            var index = list.indexOf(obj);
            list.splice(index  , 1);
            this.trigger('afterQueryResultChanged' , [this.queryResult]);
        }
        this.getAttribute = function(obj , name){
            var ret = obj;
            var names = name.split('.');
            for(var i = 0; i < names.length; i++){
                ret = ret[names[i]];
            }
            return ret;
        }
        /**
         * 删除记录
         * @param obj 要删除的对象
         */
        this.del = function(obj){
            Util.hideLoading();
            Util.confirm('确定删除['+ (this.getAttribute(obj , this.nameAttribute) || '') +']吗?' , function(){
                /*组合参数*/
                var params = {};
                params[self.idAttribute] = obj[self.idAttribute];
                params[self.verAttribute] = obj[self.verAttribute];
                /*调用后台服务*/
                Http.post(self.deleteUrl , params, function(result){
                    Util.hideLoading();
                    PageTips.success('删除成功');
                    self.selectedObj = null;
                    if(self.deleteRefresh){
                        self.refresh();
                    }else{
                        self.remove(obj);
                    }
                    self.trigger('afterDelete');
                },function(result){
                    Util.hideLoading();
                    PageTips.error(result.message);
                });
            });
        }
    };
    //返回操作对象
    return new function(){
        /**
         * 创建实例
         * @param options 参数项
         */
        this.create = function(options){
            return new UC(options);
        },
        /**
         * 验证表单
         */
        this.validateForm = function(form){
            return Form.validate(form);
        }
    };
});
