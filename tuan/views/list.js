﻿/// <summary>
/// 团购酒店列表 creator:caofu; createtime:2013-08-05
/// </summary>
define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('list')], function (libs, c, CommonStore, TuanStore, TuanModels, html) {
    var listModel = TuanModels.TuanListModel.getInstance(),
    searchStore = TuanStore.GroupSearchStore.getInstance(),
    returnPageStore = TuanStore.OrderDetailReturnPage.getInstance(),
    tuanCityListModel = TuanModels.TuanCityListModel.getInstance(), //团购城市
    pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
    positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
    brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
    timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(); //日期筛选条件
    var View = c.view.extend({
        pageid: '212001',
        tpl: html,
        hasAd: false,
        adContainer: 'in_footer',
        _onWidnowScroll: null, //滚动条事件句柄
        totalPages: null, //总页数
        isComplete: false, //是否完成
        isLoading: false,
        pageSize: 25, //每页加载数
        render: function () {
            this.$el.html(this.tpl);
            this.elsBox = {
                lst_tpl: this.$el.find('#listtpl'), //团购列表模板
                lstbox: this.$el.find('#lstbox')//团购列表容器
            };
            this.lstboxfun = _.template(this.elsBox.lst_tpl.html());
        },
        events: {
            'click #js_home': 'homeAction', //返回首页
            'click #js_return': 'returnAction', //返回查询页
            'click .jsHotel': 'returnHotel', //返回酒店查询页
            'click #selCity': 'cityAction', //选择城市
            'click #orderby': 'showOrder', //显示排序
            'click #selOrder>p[data-id]': 'orderAction', //排序
            'blur #orderby': 'hideOrderAction', //隐藏排序
            'click #filter': 'filterAction', //筛选
            'click li[data-id]': 'detailAction'//详情页
        },
        hideOrderAction: function () {
            if ($('#orderby').hasClass('tab_popshow')) { $('#orderby').removeClass('tab_popshow'); $('#orderby').attr('data-order', 0); }
        },
        onCreate: function () {
            searchStore.setAttr('pageIdx', 1);
            //滚动加载下一页数据
            this._onWidnowScroll = $.proxy(this.onWindowsScroll, this);
            this.render();
        },
        onShow: function () {
            this.setTitle('酒店团购');
        },
        onLoad: function () {
            this.showLoading();
            this.elsBox.lstbox.empty();
            var priceFilterData = pricefilterStore.get(), brandFilterData = brandfilterStore.get(), timeFilterData = timefilterStore.get();
            if (!priceFilterData && !brandFilterData && !timeFilterData) {
                var qparams = [];
                searchStore.setAttr('qparams', qparams);
            }
            var searchData = searchStore.get();
            if (returnPageStore) { returnPageStore.remove(); }
            this.getCity();
        },
        createPage: function (data) {
            var searchData = searchStore.get();
            var cityName = searchData.ctyName ? searchData.ctyName : "上海", cityid = this.getQuery('cityid');
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
            }
            searchData = searchStore.get();
            if (searchData) {
                if (searchData.sotrName) {
                    this.$el.find('.jsSortName').html(searchData.sotrName);
                } else {
                    this.$el.find('.jsSortName').html('默认排序');
                }
                cityName = searchData.ctyName ? searchData.ctyName : "上海";
                if (!searchData.ctyId || +searchData.ctyId <= 0) {
                    searchStore.setAttr('ctyId', "2");
                }
            }
            this.$el.find('#selCity').html(cityName + "<i></i>");
            //this.$el.find('header>h1').html(cityName);
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
            $(window).unbind('scroll', this._onWidnowScroll); this.hideWarning404();
        },
        onWindowsScroll: function () {
            var pos = c.ui.Tools.getPageScrollPos();
            var param = searchStore.get(); //获取查询参数
            var pageNum = isNaN(param.pageIdx) ? 1 : param.pageIdx; //当前页码
            if (param.pageIdx < this.totalPages && this.totalPages > 1) {
                this.isComplete = false;
            }
            var h = pos.pageHeight - (pos.top + pos.height);
            if (h <= 500 && !this.isComplete && !this.isLoading) {
                this.isLoading = true;
                if (param.pageIdx > this.totalPages) {
                    this.isComplete = true;
                    return;
                }
                param.pageIdx = ++pageNum;
                searchStore.setAttr('pageIdx', param.pageIdx);
                this.getGroupListData();
            }
        },
        renderList: function (data) {
            var item = this.lstboxfun(data);
            var searchData = searchStore.get();
            if (data.count && +data.count > 0 && this.totalPages && +this.totalPages > 1) {
                this.elsBox.lstbox.append(item);
            }
            else {
                if (!this.totalPages || +this.totalPages < 1 || !searchData.pageIdx || +searchData.pageIdx <= 1) {
                    item = this.cSales.replaceStrTel(item);
                    this.elsBox.lstbox.html(item);
                }
            }
        },
        getGroupListData: function () {
            this.showLoading();
            listModel.excute(function (data) {
                this.isLoading = false;
                this.hideLoading();
                var lst = data;
                if (data && data.products && data.count && +data.count > 0) {
                    this.totalPages = Math.ceil(data.count / this.pageSize);
                    if (this.totalPages > 1) {
                        $(window).bind('scroll', this._onWidnowScroll);
                    }
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
                    $(window).unbind('scroll', this._onWidnowScroll);
                }

            }, function (err) {
                this.hideLoading();
                this.isLoading = false;
                this.isComplete = true;
                var d = {};
                var msg = err.msg ? err.msg : '没找到符合条件的结果，请修改条件重新查询';
                if (this.totalPages <= 0) {
                    d.msg = msg;
                    d.products = null;
                    d.count = 0;
                    this.elsBox.lstbox.empty();
                }
                searchStore.setAttr('pageIdx', 1);
                this.renderList(d);
                $(window).unbind('scroll', this._onWidnowScroll);
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
            var target = $(e.currentTarget);
            var sortRule = target.attr('data-id'), sortType = target.attr('data-type'), sotrName = target.html();
            searchStore.setAttr('sortRule', sortRule);
            searchStore.setAttr('sortType', sortType);
            searchStore.setAttr('sotrName', sotrName);
            searchStore.setAttr('pageIdx', 1);
            $('.jsSortName').html(sotrName);
            this.elsBox.lstbox.empty();
            this.getGroupListData();
        },
        filterAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this._onWidnowScroll);
            //前往筛选页
            this.forward('filter');
        },
        cityAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this._onWidnowScroll);
            //前往城市选择页
            this.forward('citylist');
        },
        returnAction: function (e) {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this._onWidnowScroll);
            pricefilterStore.remove();
            positionfilterStore.remove();
            brandfilterStore.remove();
            timefilterStore.remove();
            this.jump('/html5/hotel/');
        },
        homeAction: function () {
            searchStore.setAttr('pageIdx', 1);
            $(window).unbind('scroll', this._onWidnowScroll);
            var qparams = [];
            searchStore.setAttr('qparams', qparams);
            searchStore.setAttr('sortRule', 2);
            searchStore.setAttr('sortType', 0);
            searchStore.setAttr('sotrName', '');
            pricefilterStore.remove();
            positionfilterStore.remove();
            brandfilterStore.remove();
            timefilterStore.remove();
            this.jump('/html5/');
        },
        returnHotel: function (e) {
            this.returnAction(e);
        }
    });
    return View;
});