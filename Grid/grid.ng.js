define(['angular'],
	function () {
        /*
         *  @views
         */
		var gridtpl = '/js/ng_app/themes/uikit-thm/backend/view/grid.ng.html';
        /*
         *  @app
         */
		var gridCmpName = 'grid.view.components';
		var gridCmpGeneral = angular.module(gridCmpName, []);
        /*
         *  @app_register
         */
		gridCmpGeneral
			.config(config)
			.run(run)
			.component('gridCmp', {
				templateUrl: gridtpl,
				bindings: {
					gridobj: '<'
				},
				controllerAs: 'gridCmp',
				controller: gridCmp
			});
        /*
         *  @app_functions
         */
		function config() {
			"use strict";
		}

		function run() {
			"use strict";
		}

		function gridCmp($scope, $filter, $compile) {
			"use strict";
			var $ctrl = this;
			$ctrl.griddata = [], $ctrl.checkAll = false, $ctrl.datacheck = [], $ctrl.selectdata = null, $ctrl.haveafilter = false, $ctrl.paginatorHtml = '';
			$ctrl.maxdate = moment.tz('America/Havana').add(1, 'd').hour(12).startOf('h'), $ctrl.filter = {};

			$ctrl.$onInit = function () {

				$ctrl.gridobj.updateData = function () {
					$ctrl.datacheck = []; $ctrl.checkAll = false;
					$ctrl.griddata = $ctrl.gridobj.data;
				};

				$ctrl.gridobj.updatePaginator = function () {
					$ctrl.createPaginator();
				};

				if (typeof $ctrl.gridobj.onInit === 'function')
					$ctrl.gridobj.onInit();
			};

			$ctrl.setItemsOnPage = function (num) {
				if ($ctrl.gridobj.paginator.itemsOnPage !== num) {
					$ctrl.gridobj.paginator.itemsOnPage = num;
					$ctrl.gridobj.paginator.currentPage = 1;
					$ctrl.createPaginator();
					if (typeof $ctrl.gridobj.onSetItemsOnPage === 'function')
						$ctrl.gridobj.onSetItemsOnPage(num);
				}
			};

			$ctrl.getPropValue = function (propstr, data, pos, conf) {
				var props = propstr.split('.');
				if (typeof conf !== 'undefined') {
					if (typeof conf['render'] === 'function') {
						return conf.render(propstr, data, pos);
					}
					return data[props[pos]];
				} else {
					if (data[props[pos]]) {
						if (typeof data[props[pos]] !== 'object') {
							return data[props[pos]];
						} else if (typeof data[props[pos]] === 'object' && angular.isDate(data[props[pos]])) {
							return $filter('date')(data[props[pos]], 'dd/MM/yyyy hh:mm');
						} else {
							return $ctrl.getPropValue(propstr, data[props[pos]], pos + 1, conf);
						}
					}
				}
				return '';
			};

			$ctrl.selectData = function (data) {
				$ctrl.selectdata = ($ctrl.selectdata === null) ? data :
					($ctrl.selectdata.$$hashKey === data.$$hashKey) ? null : data;
				if (typeof $ctrl.gridobj.onSelectData === 'function')
					$ctrl.gridobj.onSelectData($ctrl.selectdata);
			};

			$ctrl.createPaginator = function () {
				var range = [];
				$ctrl.paginatorHtml = '';
				var cant = ($ctrl.gridobj.paginator.items / $ctrl.gridobj.paginator.itemsOnPage);
				cant = (cant > parseInt(cant)) ? parseInt(cant) + 1 : cant;

				var start = $ctrl.gridobj.paginator.currentPage - 4;
				var limit = $ctrl.gridobj.paginator.currentPage + 4;

				start = (start <= 1) ? 1 : (limit >= cant) ? start + (cant - limit) : start;
				limit = (limit >= cant) ? cant : ((start - 4) < 1) ? limit - ($ctrl.gridobj.paginator.currentPage - start - 4) : limit;

				if ($ctrl.gridobj.paginator.currentPage > 1)
					$ctrl.paginatorHtml += ('<li id="gridpaginleftarrow" ng-class="[{\'uk-disabled\': gridCmp.gridobj.paginator.currentPage <= 1}]"><a ng-click="gridCmp.selectPage(gridCmp.gridobj.paginator.currentPage-1);"><span uk-pagination-previous></span></a></li>');
				for (var index = start; index <= limit; index++) {
					if (start > 1 && index === start) {
						$ctrl.paginatorHtml += ('<li class="uk-disabled"><span>...</span></li>');
					}
					var page = '<li id="page' + index + '" class="gridpaginpage" ng-class="[{\'uk-active\': gridCmp.gridobj.paginator.currentPage === ' + index + '}]"><a ng-class="[{\'uk-text-primary uk-text-bold\': gridCmp.gridobj.paginator.currentPage === ' + index + '}]" ng-click="gridCmp.selectPage(' + parseInt(index) + ');">' + parseInt(index) + '</a></li>';
					$ctrl.paginatorHtml += (page);
					if (cant > limit && index === limit) {
						$ctrl.paginatorHtml += ('<li class="uk-disabled"><span>...</span></li>');
					}
				}
				if ($ctrl.gridobj.paginator.currentPage < cant)
					$ctrl.paginatorHtml += ('<li id="gridpaginrightarrow" ng-class="[{\'uk-disabled\': gridCmp.gridobj.paginator.currentPage >= ' + cant + '}]"><a ng-click="gridCmp.selectPage(gridCmp.gridobj.paginator.currentPage+1);"><span uk-pagination-next></span></a></li>');
			};
			$ctrl.selectPage = function (page) {
				$ctrl.gridobj.paginator.currentPage = page;
				$ctrl.createPaginator();
				if (typeof $ctrl.gridobj.onSelectPage === 'function')
					$ctrl.gridobj.onSelectPage($ctrl.gridobj.paginator.currentPage);
			}
			$ctrl.changeCheckData = function () {
				var check = $filter('filter')($ctrl.datacheck, { check: true });
				$ctrl.checkAll = check.length === $ctrl.griddata.length;
				if (typeof $ctrl.gridobj.onCheck === 'function')
					$ctrl.gridobj.onCheck($ctrl.getCheckeds());
			};
			$ctrl.checkAllChange = function () {
				angular.forEach($ctrl.datacheck, function (val) {
					val.check = $ctrl.checkAll;
				});
				var check = $filter('filter')($ctrl.datacheck, { check: true });
				if (typeof $ctrl.gridobj.onCheck === 'function')
					$ctrl.gridobj.onCheck($ctrl.getCheckeds());
			};

			$ctrl.getCheckeds = function () {
				var checks = $filter('filter')($ctrl.datacheck, { check: true });
				var result = [];
				angular.forEach(checks, function (val) {
					result.push(val.prop);
				});
				return (result.length) ? result : null;
			};

			$ctrl.getHeaderOrder = function (header) {
				if (typeof header.order === 'boolean' && header.order) {
					header.order = { type: 'default' };
					header.class = ['fa-sort'];
				} else if (typeof header.order === 'object') {
					var dir = (header.order.dir) ? header.order.dir : false;
					if (!dir) {
						header.class = ['fa-sort'];
					} else {
						if (header.order.type === 'numeric' || header.order.type === 'alpha') {
							header.class = ['fa-sort-' + header.order.type + '-' + dir.toLowerCase()];
						} else {
							header.class = ['fa-sort-' + dir];
						}
					}
				}
			};
			$ctrl.changeHeaderOrder = function (header, i) {
				if (header.order !== false) {
					if (typeof header.order === 'object')
						switch (header.order.dir) {
							case 'ASC':
								header.order.dir = 'DESC';
								break;
							case 'DESC':
								header.order.dir = false;
								break;
							default:
								header.order.dir = 'ASC';
						}
					$ctrl.getHeaderOrder(header);
					if (typeof $ctrl.gridobj.onOrder === 'function') {
						if (!header.order.dir)
							$ctrl.gridobj.onOrder('created_at', 'DESC');
						else
							$ctrl.gridobj.onOrder($ctrl.gridobj.props[i], header.order.dir);
					}
				}
			};
		}
	});