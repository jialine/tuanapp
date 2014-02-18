/// <summary>
/// 团购酒店品牌筛选 creator:caofu; createtime:2013-08-07
/// </summary>
define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('brandfilter')], function (libs, c, CommonStore, TuanStore, TuanModels, html) {
    var brandFilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
        brandStorage = TuanStore.GroupConditionStore.getInstance(); //团购筛选数据

    var View = c.view.extend({
        pageid: '214006',
        tpl: html,
        render: function () {
            this.$el.html(this.tpl);
            this.elsBox = {
                filter_tpl: this.$el.find('#filterTpl'), //筛选模板
                filter_box: this.$el.find('#filterBox')//筛选容器
            };
            this.filter_fun = _.template(this.elsBox.filter_tpl.html());
        },
        events: {
            'click #js_return': 'returnAction', //返回筛选主页
            'click li[data-id]': 'filterAction'//确认查询条件
        },
        onCreate: function () {
            this.render();
        },
        onShow: function () {
            this.setTitle('品牌筛选');
        },
        onLoad: function () {
            this.turning();
            this.showFilter();
        },
        showFilter: function () {
	        var brandData = brandStorage.get(),
		        filterData = brandFilterStore.get(),
	            item;

	        this.elsBox.filter_box.empty();
            brandData.val = '';
            if (filterData && filterData.val) {
                brandData.val = filterData.val;
            };
            item = this.filter_fun(brandData);
            this.elsBox.filter_box.html(item);
        },
        onHide: function () { },
        filterAction: function (e) {
	        var target = $(e.currentTarget),
		        id = target.attr('data-id'),
		        brandName = target.html();

	        brandFilterStore.setAttr('type', 3);
	        brandFilterStore.setAttr('val', id);
	        brandFilterStore.setAttr('value', id);
	        brandFilterStore.setAttr('name', brandName);
	        this.forward('filter');
        },
        returnAction: function () {
            this.back('filter');
        }
    });
    return View;
});