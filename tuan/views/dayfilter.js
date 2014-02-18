/**
 * @author: xuweichen
 * @date: 14-2-17 下午2:53
 * @descriptions
 */
define(['cBasePageView','TuanStore' ,TuanApp.getViewsPath('dayfilter')], function (baseview, TuanStore, tpl) {
	var dayfilterStore = TuanStore.GroupDayFilterStore.getInstance(),
		View;

	View = baseview.extend({
		pageid:'214004',
		tpl:tpl,
		render:function () {
//			debugger;
			this.$el.html(this.tpl);
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
		returnAction: function(){
			this.back();
		},
		onCreate:function () {
//			debugger;
			this.render();
		},
		onShow:function () {
			this.setTitle('类型');
		},
		filterAction: function(e){
			var target = $(e.target);

			dayfilterStore.set({
				name: target.attr('data-name'),
				val: target.attr('data-id')
			});
			this.forward('filter');
		},
		showFilter: function(){
			var self = this;
			var data = dayfilterStore.get();

			self.elsBox.filter_box.html(self.filter_fun(data));
		},
		onLoad:function () {
			this.turning();
			this.showFilter();
		}
	});
	return View
});