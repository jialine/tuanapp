/// <summary>
/// 团购酒店列表 creator:caofu; createtime:2013-08-05
/// </summary>
define(['c', 'cBasePageView', 'cWidgetFactory', 'cUIToast', 'TuanStore', 'TuanModel', 'TuanFilters','StoreManage', TuanApp.getViewsPath('list'), 'cWidgetGeolocation'], function (c, BasePage, WidgetFactory, Toast, TuanStore, TuanModels, ToolBar, StoreManage, html) {
    var listModel = TuanModels.TuanListModel.getInstance(),
	    searchStore = TuanStore.GroupSearchStore.getInstance(),
	    returnPageStore = TuanStore.OrderDetailReturnPage.getInstance(),
	    tuanCityListModel = TuanModels.TuanCityListModel.getInstance(), //团购城市
	    pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
	    positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
	    brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
	    timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(), //日期筛选条件
	    View;

    View = BasePage.extend({
        pageid: '212001',
        tpl: html,
        totalPages: null, //总页数
        isComplete: false, //是否完成
        isLoading: false,
	    isScrolling: false,
        pageSize: 25, //每页加载数
        render: function () {
	        var wrap = this.$el;
	        //将模板渲染到页面
	        wrap.html(this.tpl);
	        //团购列表模板
	        this.itemTpl = wrap.find('#listtpl');
	        //团购列表容器
	        this.listWrap = wrap.find('#lstbox');
	        //筛选项容器
	        this.filterWrap = wrap.find('.tab_search');
	        //列表渲染函数
            this.itemRenderFn = _.template(this.itemTpl.html());

        },
        events: {
            'click #js_home': 'homeAction', //返回首页
            'click #js_return': 'returnAction', //返回查询页
            'click .jsHotel': 'returnHotel', //返回酒店查询页
            'click #J_positionTrigger': 'showPositionPage', //选择位置区域
            'click #orderby': 'showOrder', //显示排序
            'click #selOrder>p[data-id]': 'orderAction', //排序
            'blur #orderby': 'hideOrderAction', //隐藏排序
            'click #filter': 'filterAction', //筛选
            'click li[data-id]': 'detailAction',//详情页
	        'click #J_headerTitle': 'showCityPage',
	        'click #J_keywordSearch': 'showKeywordSearch',
	        'click .cur_reload': 'getGeolocation'

        },
	    createGPS: function(){
			this.gps = WidgetFactory.create('Geolocation');
	    },
	    getGeolocation: function(){
		    var infoWrap = $('#J_gpsInfo'),
			    self = this,
			    successFn, errorFn;

		    successFn = function(gpsInfo){
			    infoWrap.html('您的位置：'+gpsInfo.address);
		    };
		    errorFn = function(){
			    infoWrap.html('暂未定位信息');
				self.toast.show('抱歉，获取不到当前位置，请打开GPS后重试!');
		    };

			if(!this.gps){
				this.createGPS();
			};
		    infoWrap.html('定位中');
		    this.gps.requestCityInfo(successFn, errorFn);
	    },
	    initTuanFilters: function(){
		    var TuanFilters = WidgetFactory.create('TuanFilters');
			//必须判断，否则会重复绑定事件
		    !this.tuanfilters && (this.tuanfilters = new TuanFilters({
			    page: this
		    }));
	    },
        hideOrderAction: function () {
            if ($('#orderby').hasClass('tab_popshow')) { $('#orderby').removeClass('tab_popshow'); $('#orderby').attr('data-order', 0); }
        },
	    onPageListRequestStart: function(){
		    this.filterWrap.addClass('hide');
	    },
	    onPageListRequestEnd: function(){
		    this.filterWrap.removeClass('hide');
	    },
        onCreate: function () {
	        this.toast = new Toast();
            searchStore.setAttr('pageIdx', 1);
            //滚动加载下一页数据
            this.onWindowScroll = $.proxy(this._onWindowScroll, this);
	        this.createGPS();
            this.render();
        },
        onShow: function () {
//            this.setTitle('酒店团购<i>》</i>');
        },
        onLoad: function () {
            this.showLoading();
	        this.listWrap.empty();

            var priceFilterData = pricefilterStore.get(),
	            brandFilterData = brandfilterStore.get(),
	            timeFilterData = timefilterStore.get();
	        //如果没有筛选条件，则清空查询条件
            if (!priceFilterData && !brandFilterData && !timeFilterData) {
                searchStore.setAttr('qparams', []);
            };

	        // TODO: 补充注释
            if (returnPageStore) { returnPageStore.remove(); }
            this.getCity();

	        this.initTuanFilters();
	        this.getGeolocation();
        },
        createPage: function (data) {
            var searchData = searchStore.get(),
                cityName = searchData.ctyName ? searchData.ctyName : "上海",
	            cityid = this.getQuery('cityid'),
	            wrap = this.$el;

	        if (cityid && +cityid > 0) {
                //判断是否有历史记录，有则不替换
                if (!searchData.ctyId || searchData.ctyId.length <= 0) {
                    //判断该城市是否在团购酒店城市中
                    if (data && data.cities) {
                        var citysArr = [];
                        $.grep(data.cities, function (n, i) {
                            $.grep(n.cities, function (v, j) {
                                if (v.id == cityid)
                                    citysArr.push({
                                        id: v.id,
                                        name: v.name
                                    });
                            });
                        });
                        if (citysArr && citysArr.length > 0) {
                            cityName = citysArr[0].name;
                            searchStore.setAttr('ctyId', cityid);
                        } else {
                            searchStore.setAttr('ctyId', "2");
                        }
                    } else {
                        searchStore.setAttr('ctyId', "2");
                    }
                    searchStore.setAttr('ctyName', cityName);
                }
            };
            searchData = searchStore.get();
	        //如果有搜索条件则初始化相应查询条件
            if (searchData) {
               /* if (searchData.sortName) {
                    this.$el.find('.jsSortName').html(searchData.sortName);
                } else {
                    this.$el.find('.jsSortName').html('默认排序');
                };*/
                cityName = searchData.ctyName ? searchData.ctyName : "上海";
                if (!searchData.ctyId || +searchData.ctyId <= 0) {
                    searchStore.setAttr('ctyId', "2");
                }
            };
	        //设置标题
	        wrap.find('#selCity').html(cityName + "<i></i>");
	        wrap.find('header>h1').html("团购酒店-"+cityName);
            this.turning();
            this.getGroupListData();
        },
        getCity: function () {
            tuanCityListModel.excute(function (data) {
                this.createPage(data);
            }, function (err) {
                this.createPage(err);
            }, false, this);
        },
        onHide: function () {
            $(window).unbind('scroll', this.onWindowScroll); this.hideWarning404();
        },
        _onWindowScroll: function () {
            var pos = c.ui.Tools.getPageScrollPos(),
                param = searchStore.get(), //获取查询参数
	            pageNum = isNaN(param.pageIdx) ? 1 : param.pageIdx; //当前页码

            if (param.pageIdx < this.totalPages && this.totalPages > 1) {
                this.isComplete = false;
            };
            var h = pos.pageHeight - (pos.top + pos.height);
            if (h <= 500 && !this.isComplete && !this.isLoading) {
                this.isLoading = true;
                if (param.pageIdx > this.totalPages) {
                    this.isComplete = true;
                    return;
                }
                param.pageIdx = ++pageNum;
                searchStore.setAttr('pageIdx', param.pageIdx);
	            this.onPageListRequestStart();
                this.getGroupListData();
            }
        },
        renderList: function (data) {
            var item = this.itemRenderFn(data);
            var searchData = searchStore.get();
            if (data.count && +data.count > 0 && this.totalPages && +this.totalPages > 1) {
                this.listWrap.append(item);
            }
            else {
                if (!this.totalPages || +this.totalPages < 1 || !searchData.pageIdx || +searchData.pageIdx <= 1) {
                    item = this.cSales.replaceStrTel(item);
                    this.listWrap.html(item);
                }
            }
        },
        getGroupListData: function () {
            this.showLoading();
            listModel.excute(function (data) {
                this.isLoading = false;
                this.hideLoading();
	            this.onPageListRequestEnd();

                var lst = data;

                if (data && data.products && data.count && +data.count > 0) {
                    this.totalPages = Math.ceil(data.count / this.pageSize);
                    if (this.totalPages > 1) {
                        $(window).bind('scroll', this.onWindowScroll);
                    };
                    this.renderList(lst);
                } else {
                    if (this.totalPages || this.totalPages <= 0) {
                        lst = {};
                        lst.msg = '没找到符合条件的结果，请修改条件重新查询';
                        lst.products = null;
                        lst.count = 0;
                        this.renderList(lst);
                    }
                    searchStore.setAttr('pageIdx', 1);
                    this.isComplete = true;
                    $(window).unbind('scroll', this.onWindowScroll);
                }

            }, function (err) {
                this.hideLoading();
                this.isLoading = false;
                this.isComplete = true;
	            this.onPageListRequestEnd();
                var d = {};
                var msg = err.msg ? err.msg : '没找到符合条件的结果，请修改条件重新查询';
                if (this.totalPages <= 0) {
                    d.msg = msg;
                    d.products = null;
                    d.count = 0;
                    this.listWrap.empty();
                }
                searchStore.setAttr('pageIdx', 1);
                this.renderList(d);
                $(window).unbind('scroll', this.onWindowScroll);
            }, false, this);
        },
        detailAction: function (e) {
            //查看团购详情
            searchStore.setAttr('pageIdx', 1);
            var id = $(e.currentTarget).attr('data-id');
            this.forward('tuandetail!' + id);
        },
        showOrder: function (e) {
            var target = $(e.currentTarget);
            var isShow = target.attr('data-order');
            if (isShow && +isShow > 0) {
                if (target.hasClass('tab_popshow')) { target.removeClass('tab_popshow'); }
                target.attr('data-order', 0);
            } else {
                if (!target.hasClass('tab_popshow')) { target.addClass('tab_popshow'); }
                target.attr('data-order', 1);
            }
        },
        orderAction: function (e) {
            //选择排序
            var target = $(e.currentTarget),
	            sortRule = target.attr('data-id'),
	            sortType = target.attr('data-type'),
	            sortName = target.html();

            searchStore.setAttr('sortRule', sortRule);
            searchStore.setAttr('sortType', sortType);
            searchStore.setAttr('sortName', sortName);
            searchStore.setAttr('pageIdx', 1);
            $('.jsSortName').html(sortName);
            this.listWrap.empty();
            this.getGroupListData();
        },
        filterAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this.onWindowScroll);
            //前往筛选页
            this.forward('filter');
        },
        cityAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this.onWindowScroll);
            //前往城市选择页
            this.forward('citylist');
        },
        returnAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this.onWindowScroll);
            pricefilterStore.remove();
            positionfilterStore.remove();
            brandfilterStore.remove();
            timefilterStore.remove();
            this.jump('/html5/hotel/');
        },
        homeAction: function () {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this.onWindowScroll);
            StoreManage.clearSpecified();
            this.jump('/html5/');
        },
        returnHotel: function (e) {
            this.returnAction(e);
        },
	    showCityPage: function(e){
		    e.preventDefault();
		    this.forward('citylist');
	    },
	    showPositionPage: function(){
			this.forward('positionfilter');
	    },
	    showKeywordSearch: function(e){
		    e.preventDefault();
			console.log('showKeywordSearch');
	    }
    });
    return View;
});