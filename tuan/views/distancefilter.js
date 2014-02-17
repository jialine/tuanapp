/**
 * @author: xuweichen
 * @date: 14-2-17 下午2:53
 * @descriptions
 */
define(['cBasePageView', TuanApp.getViewsPath('distancefilter')], function (baseview, tpl) {
	var View = baseview.extend({
		pageid:'214004',
		tpl:tpl,
		render:function () {
//			debugger;
			this.$el.html(this.tpl);
			this.elsBox = {
				filter_tpl:this.$el.find('#filterTpl'), //筛选模i板
				filter_box:this.$el.find('#filterBox')//筛选容器
			};
			debugger;
			this.filter_fun = _.template(this.elsBox.filter_tpl.html());
		},
		events:{
			'click #js_return':'returnAction', //返回筛选主页
			'click li[data-type]':'selAction', //切换筛选条件
			'click li[data-id]':'filterAction'//确认查询条件
		},
		returnAction: function(){
			this.back();
		},
		onCreate:function () {
//			debugger;
			this.render();
		},
		onShow:function () {
			this.setTitle('距离');
		},
		filterAction: function(e){
			console.log(e.target);
		},
		showFilter: function(){
			var self = this;
//			var filterData = priceStartFilterStore.get(),
//				item;//上一次搜索条件
//
//			filterData.Category = categoryFilterStore.getAttr('category');
//			item = this.filter_fun(filterData);
			self.elsBox.filter_box.html(self.filter_fun({}));
		},
		onLoad:function () {
			this.turning();
			debugger;
			this.showFilter();
		}
	});
	return View
});