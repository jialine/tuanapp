/**
 * @author: xuweichen
 * @date: 14-2-13 下午1:13
 * @descriptions
 */
define(['cBase', 'cWidgetFactory', 'DropDown', 'TuanStore', 'StoreManage'], function (Base, WidgetFactory, DropDown, TuanStore, StoreManage) {
	"use strict";
	var WIDGET_NAME = 'TuanFilters',
		Filters,
		mix = $.extend,
		categoryfilterStore = TuanStore.GroupCategoryFilterStore.getInstance(), //团购类型
		sortStore = TuanStore.GroupSortStore.getInstance(), //团购排序
		searchStore = TuanStore.GroupSearchStore.getInstance();

	window.searchStore = searchStore;
	// 如果WidgetFactory已经注册了,就无需重复注册
	if (WidgetFactory.hasWidget(WIDGET_NAME)) {
		return;
	};

	Filters = new Base.Class({
		__propertys__: function(){
			this.options = {
				sortTrigger: $('#J_sortTrigger'),
				sortPanel: $('#J_sortPanel'),
				sortLabel: $('#J_sortTrigger'),
				categoryTrigger: $('#J_categoryTrigger'),
				categoryPanel: $('#J_categoryPanel'),
				categoryLabel: $('#J_categoryTrigger'),
				customFilters: $('#J_customFilters')
			};
			this.page = null;
		},
		initSort: function(){
			var self = this,
				options = self.options;

			this.sort = new DropDown({
				trigger: options.sortTrigger,
				panel: options.sortPanel,
				label: options.sortLabel,
				selectedIndex: sortStore.getAttr('sortTypeIndex')||0,
				onSelect: function(item){
					var target = $(item),
						sortRule = target.attr('data-id'),
						sortType = target.attr('data-type'),
						sotrName = target.html();

					sortStore.setAttr('sortTypeIndex', this.selectedIndex);
					searchStore.setAttr('sortRule', sortRule);
					searchStore.setAttr('sortType', sortType);
					searchStore.setAttr('sotrName', sotrName);
					searchStore.setAttr('pageIdx', 1);
//					this.elsBox.lstbox.empty();
					self.page.getGroupListData();
				}
			});
			return this;
		},
		initCategory: function(){
			var self = this,
				options = self.options;

			this.category = new DropDown({
				trigger: options.categoryTrigger,
				panel: options.categoryPanel,
				label: options.categoryLabel,
				selectedIndex: categoryfilterStore.getAttr('tuanTypeIndex')||0,
				onSelect: function(item){
					item = $(item);

					var tuanType = $(item).attr('data-type');

					categoryfilterStore.setAttr('tuanType', tuanType);
					categoryfilterStore.setAttr('category', item.attr('data-category'));
					searchStore.setAttr('tuanType', tuanType);
					categoryfilterStore.setAttr('tuanTypeIndex', this.selectedIndex);
					//清除除团购类型和城市外的所有查询条件
					StoreManage.clearSpecified();
//					location.reload();
					self.page.getGroupListData();
				}
			});
			return this;
		},
		initCustomFilters: function(){
//			searchStore.setAttr('pageIdx', 1);
//			$(window).unbind('scroll', this._onWidnowScroll);
			//前往筛选页
			var self = this;
			self.options.customFilters.on('click', function(){
				self.page.forward('filter');
			});

		},
		initialize: function(options){
			mix(this.options, options);
			this.page = this.options.page;
			this.initSort().initCategory().initCustomFilters();
		}
	});
	WidgetFactory.register({
		name: WIDGET_NAME,
		fn: Filters
	});

});
