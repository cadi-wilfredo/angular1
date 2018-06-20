define(['require', 'angular', 'angular-datepicker', 'ng-ckeditor', './scheckbox.ng', 'angular-file-upload'],
	function (require) {
        /*
         *  @views
         */
		var formtpl = '/js/ng_app/themes/uikit-thm/backend/view/form.ng.html';
        /*
         *  @app
         */
		var formViewCmpName = 'form.view.components';
		var formViewCmp = angular.module(formViewCmpName, [
			"ui.router", "datePicker", "ng.ckeditor", 'scheckbox.components', 'angularFileUpload'
		]);
        /*
         *  @app_register
         */
		formViewCmp
			.config(config)
			.run(run)
			.component('formCmp', {
				templateUrl: formtpl,
				bindings: {
					fields: '<', grid: '<', formname: '<', btns: '=', model: '='
				},
				controller: formCmp
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

		function formCmp($scope, $rootScope, $timeout, FileUploader, $filter) {
			"use strict";
			var $ctrl = this;
			$ctrl.sum = 0;
			$ctrl.sumA = [];
			$ctrl.options = {
				language: 'en',
				allowedContent: true,
				entities: false
			};
			$ctrl.uploader = false;
			$ctrl.exist_files = false;
			$ctrl.$onInit = function () {
				$ctrl.exist_files = $filter('filter')($ctrl.fields, { type: 'file', required: true });
				if ($ctrl.exist_files && $ctrl.exist_files.length) {
					$ctrl.uploader = new FileUploader({
						url: 'upload.php',
						queueLimit: 1,
						formData: $ctrl.model
					});
				}
				angular.forEach($ctrl.grid, function (val) {
					if (val === '|') {
						$ctrl.sumA.push(0)
					} else {
						$ctrl.sum += val;
						$ctrl.sumA.push($ctrl.sum);
					}
				});

			};
			$ctrl.generate = function (field, model) {
				for (var word = "", chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					word.length < (field.charslength ? field.charslength : 10);
					word += chars.charAt(Math.floor(Math.random() * chars.length)));
				field.value = word;
				return word;
			};
			$ctrl.reveal = function (field) {
				field.type = (field.type === 'text') ? 'password' : 'text';
			};
			$ctrl.validConditions = function (field) {
				var valid = true;
				if (typeof field['conditions'] !== 'undefined' && field['conditions'].length) {
					for (var i = 0; i < field['conditions'].length; i++) {
						if (typeof $ctrl.model[field['conditions'][i].field] !== 'undefined') {
							valid = $ctrl.model[field['conditions'][i].field] === field['conditions'][i].rule;
							if (!valid) return false;
						}
					}
				}
				return valid;
			}
			$ctrl.validIfFilesRequired = function (field) {
				if (field.required) {
					return $ctrl.uploader.queue.length === 0;
				}
				return false;
			}
			$ctrl.uploadAll = function () {
				$ctrl.uploader.uploadAll();
			}
		}
        /*
         *Include this code in the app file for call this component
         */
		//import {register_formViewCmp, formViewCmpName, formViewCmp} from './/form.ng';
		//register_formViewCmp();

		// $ctrl.fields = [
		//     {type: 'text', field: 'username', label: 'User name', required: true, maxlength: 10, minlength: 2},
		//     {type: 'checkbox', field: 'siteTitle2', label: 'Is new?', value: true},
		//     {
		//         type: 'radio',
		//         field: 'siteTitle3',
		//         label: 'Gender',
		//         opts: [{label: 'M', val: 'masculino'}, {label: 'F', val: 'femenino'}]
		//     },
		//     {type: 'number', field: 'siteTitle4', label: 'Number', required: true, maxlength: 10, minlength: 2},
		//     {
		//         type: 'email',
		//         field: 'siteTitle5',
		//         label: 'Email',
		//         required: true,
		//         readonly: true,
		//         disabled: true,
		//         placeholder: 'wil@w.cu'
		//     },
		//     {type: 'password', field: 'siteTitle6', label: 'Password 1', generate: true, charslength: 7},
		//     {type: 'password', field: 'siteTitle7', label: 'Password 2', reveal: true, generate: true},
		//     {type: 'password', field: 'siteTitle8', label: 'Password 1'},
		//     {
		//         type: 'select',
		//         field: 'siteTitle9',
		//         label: 'Size other 1',
		//         factory: [{id: 1, siteTitle: 'cadi'}, {id: 2, siteTitle: 'CADI'}],
		//         valprop: 'id',
		//         optprop: 'siteTitle'
		//     },
		//     {type: 'date', field: 'siteTitle10', label: 'Date', format: 'dd MMM yyyy', view: 'date', minview: 'date'},
		//     // {type: 'textarea', field: 'siteTitle11', label: 'Description', rows: 3},
		//     {type: 'ckeditor', field: 'siteTitle12', label: 'Description2', rows: 3},
		// ];
		// $ctrl.btns = [
		//     {
		//         label: 'Ascept', validable: true, class: 'uk-button-primary uk-float-right',
		//         handler: function (f) {
		//             $ctrl.parent.saveItem($ctrl.copied_item, function () {
		//                 $state.go('securityAction.userAction');
		//             });
		//         }
		//     }, {
		//         label: 'Apply', validable: true, class: 'uk-button-success uk-float-right',
		//         handler: function (f) {
		//             $ctrl.parent.saveItem($ctrl.copied_item, function () {
		//                 if ($ctrl.action != 'edit') {
		//                     $ctrl.copied_item = null;
		//                 }
		//             });
		//         }
		//     }, {
		//         label: 'Cancel', class: 'uk-button-danger uk-float-right', handler: function (f) {
		//             $state.go('securityAction.userAction');
		//         }
		//     }
		// ];
	});