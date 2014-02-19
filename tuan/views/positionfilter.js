/// <summary>
/// 团购酒店区域筛选 creator:caofu; createtime:2013-08-09
/// </summary>
define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('positionfilter')], function (libs, c, CommonStore, TuanStore, TuanModels, html) {
    var positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
    filterStorage = TuanStore.GroupConditionStore.getInstance(), //团购筛选数据
	conditionModel = TuanModels.TuanConditionModel.getInstance(), //团购筛选Model
	searchStore = TuanStore.GroupSearchStore.getInstance(); //搜索条件
    var View = c.view.extend({
        pageid: '214005',
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
            'click .jsfilter_l>li[data-type]': 'selAction', //位置区域切换
            'click .jsfilter_r>li[data-id]': 'filterAction'//确认查询条件
        },
        onCreate: function () {
            this.render();
        },
        onShow: function () {
            this.setTitle('位置区域筛选');
        },
        onLoad: function () {            
			var searchData = searchStore.get();
			positionfilterStore.setAttr("ctyId", searchData.ctyId);//上一次搜索所属城市ID
            this.turning();
			var type = 1; //品牌
            type |= 2; // 行政区
            type |= 4; //商业区
			this.getFilterData(type,searchData.ctyId);
        },
		getFilterData: function (type,ctyId) {	
			if(conditionModel.getParam('ctyId')==ctyId&&conditionModel.getParam('type')==type){
				this.initFilterData();
				this.showFilter();
				return;
			}
            conditionModel.setParam('type', type);
			conditionModel.setParam('ctyId', ctyId);
            this.showLoading();
            conditionModel.excute(function (data) {
                this.hideLoading();
				this.initFilterData();
				this.showFilter();
            }, function (err) {
                this.hideLoading();
				this.showFilter();
            }, false, this);
        },
		initFilterData:function(){
			var filterData = positionfilterStore.get(); //上一次搜索条件
            if (filterData) {
                if (!filterData.val || +filterData.val <= 0 || !filterData.type || +filterData.type <= 0) {
                    filterStorage.setAttr('type', '5');
                    filterStorage.setAttr('typeId', 4);
                    filterStorage.setAttr('val', '');
                    filterStorage.setAttr('value', '');
                } else {
                    filterStorage.setAttr('type', filterData.type);
                    var typeId = filterData.typeId;
                    if (!typeId) {
                        if (filterData.type == 4) {
                            typeId = filterData.type == 4 ? 2 : 4;
                        }
                    }
                    filterStorage.setAttr('typeId', typeId);
                    filterStorage.setAttr('val', filterData.val);
                    filterStorage.setAttr('value', filterData.val);
                }
            } else {
                filterStorage.setAttr('type', '5');
                filterStorage.setAttr('typeId', 4);
                filterStorage.setAttr('val', '');
                filterStorage.setAttr('value', '');
            }
		},
        showFilter: function () {
            this.elsBox.filter_box.empty();
            var positionData = filterStorage.get();
            if (!positionData||!$.isArray(positionData.conditions)||positionData.conditions.length<=0) {
                var self = this;
                this.showHeadWarning('位置区域', "抱歉，暂无位置区域信息，请返回重新查询", function () {
                    self.returnAction();
                    this.hide();
                });
                return;
            }
            var filterData = positionfilterStore.get(); //上一次搜索条件
            if (filterData) {
                if (filterData.type && +filterData.type > 0 && +filterData.type == +positionData.type) {
                    positionData.val = filterData.val;
                }
            }
            var item = this.filter_fun(positionData);
            this.elsBox.filter_box.html(item);
        },
        onHide: function () { },
        returnAction: function () {
            this.back();
        },
        selAction: function (e) {
            var target = $(e.currentTarget), type = target.attr('data-filtertype');
            if (type && +type != 4) {
                $('li[data-filtertype="5"]').removeClass('hover');
            } else {
                $('li[data-filtertype="4"]').removeClass('hover');
            }
            filterStorage.setAttr('typeId', target.attr('data-type'));
            filterStorage.setAttr('type', type);
            filterStorage.setAttr('val', '');
            filterStorage.setAttr('value', '');
            this.showFilter();
        },
        filterAction: function (e) {
            var target = $(e.currentTarget), type = target.attr('data-filtertype'), val = target.attr('data-id'), txt = target.attr('data-name');
            positionfilterStore.setAttr('type', type);
            positionfilterStore.setAttr('typeId', target.attr('data-type'));
            positionfilterStore.setAttr('val', val);
            positionfilterStore.setAttr('name', txt);
            filterStorage.setAttr('type', '');
            filterStorage.setAttr('typeId', '');
            filterStorage.setAttr('val', '');
            filterStorage.setAttr('value', '');
            filterStorage.setAttr('name', '');
			
			var positionData = positionfilterStore.get();
			//设置查询条件
            var qparams = [];
			positionData = positionData ? positionData : { type: '', val: '' };
            if (positionData && positionData.type && +positionData.type > 0 && positionData.val && positionData.val != '') {
                qparams.push(
                    {
                        type: +positionData.type,
                        typeId: +positionData.typeId,
                        value: positionData.val,
                        name: positionData.name
                    }
                );
            }
            var searchData = searchStore.get();
            if (searchData) {
                if (!searchData.edate) {
                    searchStore.setAttr('edate', searchData.bdate);
                }
            }
            searchStore.setAttr('qparams', qparams);
            searchStore.setAttr('pageIdx', '1');
            //searchStore.setAttr('sortRule', '2');
            //searchStore.setAttr('sortType', '0');
            var _this = this;
            setTimeout(function () {
                _this.back("list");
            }, 100);
        }
    });
    return View;
});