define(['angular', 'angular-ui-router'],
    function () {
        /*
         *  @views
         */
        const mainmenutpl = '/js/ng_app/themes/uikit-thm/backend/view/menu/mainmenu.ng.html';
        const secondarymenutpl = '/js/ng_app/themes/uikit-thm/backend/view/menu/secondarymenu.ng.html';
        /*
         *  @app
         */
        const menuCmpName = 'menu.components';
        const menuCmpBackend = angular.module(menuCmpName, [
            "ui.router"
        ]);
        /*
         *  @app_register
         */
        function register_menuCmpBackend() {
            "use strict";
            menuCmpBackend
                .component('menuCmp', { controller: menuCmp })
                .component('mainMenuCmp', {
                    templateUrl: mainmenutpl,
                    require: { parent: '^menuCmp' }, controller: mainMenuCmp
                })
                .component('secondaryMenuCmp', {
                    templateUrl: secondarymenutpl,
                    require: { parent: '^menuCmp' },
                    controller: secondaryMenuCmp
                })
        }
        /*
         *  @app_functions
         */
        function menuCmp($scope, $timeout, $rootScope, $location, $filter, routesFact) {
            "use strict";
            var $ctrl = this;
            $ctrl.menu = $filter('filter')(routesFact, { inmenu: true });
            $ctrl.$onInit = function () {
            };
            $ctrl.setActive = function () {
                $ctrl.menu = $filter('filter')(routesFact, { inmenu: true });
                var result = {
                    action: 'activeItem',
                    active_item1: [],
                    active_item2: []
                };
                var url = ($location.path()).split('/');
                if (url[1] !== "404" && url[1] !== "401") {
                    result.active_item1 = $filter('filter')($ctrl.menu, { 'url': url[1] })[0];
                    if (typeof url[2] !== 'undefined' && url[2] !== null && result.active_item1.childrens && result.active_item1.childrens.length > 0) {
                        var childs = $filter('filter')(result.active_item1.childrens, { 'url': url[2] });
                        if (typeof childs !== 'undefined' && childs !== null && childs.length > 0)
                            result.active_item2 = childs[0];
                    }
                    $rootScope.$emit('menuEvent', result);
                }
            };
        }
        function mainMenuCmp($scope, $timeout, $rootScope, routesFact, $filter) {
            "use strict";
            var $ctrl = this;
            //
            $ctrl.mainmenu = [];
            $ctrl.active_item = null;
            //
            $ctrl.$onInit = function () {
                $ctrl.mainmenu = $filter('filter')(routesFact, { inmenu: true });
            };
            //
            $rootScope.$on('menuEvent', function (e, d) {
                if (d.action === 'activeItem')
                    $ctrl.active_item = d.active_item1;
            });
            $rootScope.$on('$locationChangeSuccess', function (e, newR, oldR) {
                $ctrl.parent.setActive();
            });
        }
        function secondaryMenuCmp($scope, $timeout, $rootScope, $filter) {
            "use strict";
            var $ctrl = this;
            //
            $ctrl.secondarymenu = [];
            $ctrl.active_item1 = null;
            $ctrl.active_item2 = null;
            $ctrl.user = {};

            //
            $ctrl.$onInit = function () {
                $ctrl.parent.setActive();
            };
            //
            $rootScope.$on('menuEvent', function (e, d) {
                if (typeof d.active_item1 !== 'undefined' && d.action === 'activeItem' && d.active_item1.childrens) {
                    $ctrl.active_item1 = d.active_item1;
                    $ctrl.secondarymenu = d.active_item1.childrens;
                    $ctrl.active_item2 = d.active_item2;
                } else {
                    $ctrl.secondarymenu = [];
                }
            });
            $rootScope.$on('$locationChangeSuccess', function (e, newR, oldR) {
                $ctrl.parent.setActive();
            });
        }
        register_menuCmpBackend();
    });