/// <summary>
/// 团购酒店筛选星级价格 creator:caofu; createtime:2013-08-07
/// </summary>
define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('pricefilter')], function (libs, c, CommonStore, TuanStore, TuanModels, html) {
	var priceStarFilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //筛选条件
		categoryFilterStore = TuanStore.GroupCategoryFilterStore.getInstance(),  //团购类型
		customFiltersStore = TuanStore.GroupCustomFilters.getInstance(); //筛选条件

	var View = c.view.extend({
		pageid:'214004',
		tpl:html,
		render:function () {
			this.$el.html(_.template(this.tpl)({Category: categoryFilterStore.getAttr('category')}));
			this.elsBox = {
				filter_tpl:this.$el.find('#filterTpl'), //筛选模i板
				filter_box:this.$el.find('#filterBox')//筛选容器
			};
			this.filter_fun = _.template(this.elsBox.filter_tpl.html());
		},
		events:{
			'click #js_return':'returnAction', //返回筛选主页
			'click li[data-type]':'selAction', //切换筛选条件
			'click li[data-id]':'filterAction'//确认查询条件
		},
		onCreate:function () {
			this.render();
		},
		onShow:function () {
			this.setTitle('价格/星级筛选');
		},
		onLoad:function () {
			this.turning();
			this.showFilter();
		},
		showFilter:function () {
			var filterData = priceStarFilterStore.get(),
			    item;//上一次搜索条件

			if(filterData){
				filterData.Category = categoryFilterStore.getAttr('category');
			};
			item = this.filter_fun(filterData);
			this.elsBox.filter_box.html(item);
		},
		onHide:function () {
		},
		selAction:function (e) {
			var target = $(e.currentTarget), type = target.attr('data-type');
			if (type && +type > 1) {
				$('li[data-type="1"]').removeClass('hover');
			} else {
				$('li[data-type="2"]').removeClass('hover');
			}
			priceStarFilterStore.setAttr('type', type);
			if (!target.hasClass('hover')) {
				target.addClass('hover');
			}
			this.showFilter();
		},
		filterAction:function (e) {
			//设置查询条件
			var target = $(e.currentTarget), id = target.attr('data-id'), type = target.attr('data-filter'), typeName = target.html();
			var _type = -1;
			if (type == "star") {
				_type = 2;
			} // 2,星级查询;
			if (type == "price") {
				_type = 1;
			} //1,价格区间查询
			if (!id || id.length < 0) {
				id = '';
			}
			if (_type == 1) {
				typeName = target.attr('data-name');
			}
			priceStarFilterStore.setAttr('name', typeName);
			priceStarFilterStore.setAttr('type', _type);
			priceStarFilterStore.setAttr('val', id);
			priceStarFilterStore.setAttr('value', id);
			this.forward('filter');
		},
		returnAction:function (e) {
			this.back('filter');
		}
	});
	return View;
});