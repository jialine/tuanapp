/// <summary>
/// 团购酒店筛选入住有效期
/// </summary>
define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('timefilter'), 'cWidgetFactory', 'cWidgetCalendar'], function (libs, c, CommonStore, TuanStore, TuanModels, html, WidgetFactory) {
    var cui = c.ui, cBase = c.base;
    var searchStore = TuanStore.GroupSearchStore.getInstance(), //搜索条件
        filterStore = TuanStore.GroupCheckInFilterStore.getInstance(); //筛选条件
    var Calendar = WidgetFactory.create('Calendar');

    var View = c.view.extend({
        pageid: '214007',
        tpl: html,
        begincCalendar: null,
        endCalendar: null,
        isSelected: false,
        render: function () {
            this.$el.html(this.tpl);
            this.els = {
                filter_begin_date: this.$el.find('#js_beginDate span'),
                filter_end_date: this.$el.find('#js_endDate span')
            };
        },
        events: {
            'click #js_return': 'returnAction', //返回筛选主页
            'click #js_beginDate': 'beginDateAction', //起始日期选择
            'click #js_endDate': 'endDateAction'//结束日期选择
        },
        onCreate: function () {
            this.render();
            this.createCalendar();
        },
        onShow: function () {
            this.setTitle('入住有效期筛选');
        },
        onLoad: function () {
            this.updatePage(function () {
                this.turning();
            });
        },
        updatePage: function (callback) {
            var dTime, eTime;
            var searchData = filterStore.get();
            if (searchData && searchData.val && searchData.val.length > 0 && searchData.beginDate && searchData.endDate) {
                this.els.filter_begin_date.html(searchData.beginDate);
                this.els.filter_end_date.html(searchData.endDate);
                dTime = searchData.beginDate;
                eTime = searchData.endDate;
                this.isSelected = true;
            } else {
                this.els.filter_begin_date.html('不限');
                this.els.filter_end_date.html('不限');
                this.isSelected = false;
            }
            dTime = !dTime ? new cBase.Date(this.getServerDate()).valueOf() : cBase.Date.parse(dTime).valueOf();
            if (eTime) {
                eTime = cBase.Date.parse(eTime).valueOf();
                //当结束时间小数
                if (eTime < dTime) eTime = dTime;
            } else {
                eTime = dTime;
            }
            if (this.isSelected) {
                this.endCalendar.update({
                    'validStartDate': dTime
                });
                this.beginCalendar.setDate({
                    start: dTime
                });
                this.endCalendar.setDate({
                    back: eTime
                });
            }
            callback.call(this);
        },
        createCalendar: function () {
            var now = this.getServerDate();
            var self = this;
            var searchData = filterStore.get();
            var dTime = searchData.beginDate, eTime = searchData.endDate;
            dTime = dTime ? cBase.Date.parse(dTime).valueOf() : this.getServerDate();
            if (dTime < now) {
                dTime = now;
                filterStore.setAttr('beginDate', cBase.Date.format(dTime, 'Y-m-d'));
            }
            if (eTime) {
                eTime = cBase.Date.parse(eTime).valueOf();
                //当结束时间小数
                if (eTime < dTime) eTime = dTime
            } else {
                eTime = dTime;
            }
            this.beginCalendar = new Calendar({
                date: {
                    start: {
                        headtitle: '<h1>起始日期</h1><i id="js_return" class="returnico"></i>',
                        title: function (date, sformat) {
                            var str = sformat(date);
                            return str;
                        },
                        value: dTime
                    }
                },
                Months: 6,
                title: '起始日期',
                callback: function (date, datename, dates) {
                    self.setBeginPanelDate.apply(self, arguments);
                    self.isSelected = true;
                    var searchData = filterStore.get();
                    var dTime = searchData.beginDate ? cBase.Date.parse(searchData.beginDate).valueOf() : null;
                    eTime = searchData.endDate ? cBase.Date.parse(searchData.endDate).valueOf() : null;
                    if (!eTime) {
                        eTime = (new cBase.Date(dTime)).valueOf();
                        self.els.filter_end_date.html(cBase.Date.format(eTime, 'Y-m-d'));
                        filterStore.setAttr('endDate', cBase.Date.format(eTime, 'Y-m-d'));
                        self.endCalendar.setDate({
                            back: eTime
                        });
                    } else {
                        if (eTime < dTime)
                            eTime = (new cBase.Date(dTime)).valueOf();
                        self.els.filter_end_date.html(cBase.Date.format(eTime, 'Y-m-d'));
                        filterStore.setAttr('endDate', cBase.Date.format(eTime, 'Y-m-d'));
                        self.endCalendar.setDate({
                            back: eTime
                        });
                    }
                    self.endCalendar.update({
                        'validStartDate': dTime
                    });
                    this.hide();
                }
            });
            this.endCalendar = new Calendar({
                date: {
                    back: {
                        headtitle: '<h1>结束日期</h1><i id="js_return" class="returnico"></i>',
                        title: function (date, sformat) {
                            var str = sformat(date);
                            return str;
                        },
                        value: eTime
                    }
                },
                Months: 6,
                title: '结束日期',
                callback: function (date, datename, dates) {
                    self.setEndPanelDate.apply(self, arguments);
                    self.isSelected = true;
                    var searchData = filterStore.get();
                    var dTime = searchData.beginDate,
                        eTime = searchData.endDate;
                    if (!dTime) {
                        dTime = self.getServerDate();
                        self.els.filter_begin_date.html(cBase.Date.format(dTime, 'Y-m-d'));
                        filterStore.setAttr('beginDate', cBase.Date.format(dTime, 'Y-m-d'));
                        self.beginCalendar.setDate({
                            start: dTime
                        });
                    }
                    this.hide();
                }
            });
        },
        setBeginPanelDate: function (date, datename, dates) {
            var title, dateinfo;
            title = [];
            dateinfo = this.beginCalendar.getDateInfo(dates.start);
            if (dateinfo.chineseday) title.push(dateinfo.chineseday);
            if (dateinfo.holiday) title.push(dateinfo.holiday);
            if (dateinfo.daytitle) title = [dateinfo.daytitle];
            title.push(dateinfo.week);
            this.els.filter_begin_date.html(cBase.Date.format(dates.start, 'Y-m-d'));
            filterStore.setAttr('beginDate', cBase.Date.format(dates.start, 'Y-m-d'));
        },
        setEndPanelDate: function (date, datename, dates) {
            var title, dateinfo;
            title = [];
            dateinfo = this.endCalendar.getDateInfo(dates.back);
            if (dateinfo.chineseday) title.push(dateinfo.chineseday);
            if (dateinfo.holiday) title.push(dateinfo.holiday);
            if (dateinfo.daytitle) title = [dateinfo.daytitle];
            title.push(dateinfo.week);
            this.els.filter_end_date.html(cBase.Date.format(dates.back, 'Y-m-d'));
            filterStore.setAttr('endDate', cBase.Date.format(dates.back, 'Y-m-d'));
        },
        beginDateAction: function () {
            this.beginCalendar.setCurDate('start');
            this.beginCalendar.show();
        },
        endDateAction: function () {
            this.endCalendar.setCurDate('back');
            this.endCalendar.show();
        },
        onHide: function () { },
        returnAction: function (e) {
            this.isSelected = false;
            var searchData = filterStore.get();
            if (searchData && searchData.beginDate && searchData.endDate) {
                filterStore.setAttr('val', searchData.beginDate + '|' + searchData.endDate);
                filterStore.setAttr('name', searchData.beginDate + '至' + searchData.endDate);
            } else {
                filterStore.remove();
            }
            this.back('filter');
        }
    });
    return View;
});