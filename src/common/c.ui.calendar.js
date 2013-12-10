/* File Created: 六月 23, 2013 */

define(['cBase', 'cUICore', 'cChineseCal','cUtility'], function (cBase, cUICore, ChineseCalendar,cUtility) {

    var Calendar = new cBase.Class(cUICore.AbstractView, {
        __propertys__: function () {
            this.chineseHoliday = {
                '1230': '除夕',
                '0101': '春节',
                '0115': '元宵',
                '0405': '清明',
                '0505': '端午',
                '0707': '七夕',
                '0815': '中秋',
                '0909': '重阳',
                '0405': '清明'
            },
                this.holiday = {
                    '0101': '元旦',
                    '0214': '情人节',
                    '0501': '五一',
                    '1001': '国庆',
                    '1225': '圣诞节'
                };
            this.DAYTITLE = {
                0: '周日',
                1: '周一',
                2: '周二',
                3: '周三',
                4: '周四',
                5: '周五',
                6: '周六'
            };
            this.DAYTITLE2 = {
                0: '星期日',
                1: '星期一',
                2: '星期二',
                3: '星期三',
                4: '星期四',
                5: '星期五',
                6: '星期六'
            };
            this.addClass(cUICore.config.prefix + 'calendar');
            //开始月份
            this.startMonth = cUtility.getServerDate();
            this.startMonth.setDate(1);
            //显示几个月
            this.Months = 5;
            //有效选择开始时间
            this.validStartDate = cUtility.getServerDate();;
            this.validStartDate.setHours(0, 0, 0, 0);
            //有效选择结束时间
            this.validEndDate;
            //被选中时间
            this.date;
            //时间值
            this.dateVal = {};
            //titledom
            this.titledom;
            //leftback
            this.leftback;
            //类
            this.cls = ['calenar'];
            this.callback = function () { };
            //标题
            this.title;
            //定位方式不是绝对定位
            this.noabsolute = false;

            //当前时间
            this.curDate;
            this.dateDoms = {};
            this.html;
            this.windowResizeHander;
            this.hashObserve = new cUICore.HashObserve({
                hash: this.id,
                callback: function () {
                    this.hide();
                },
                scope: this
            });
        },
        initialize: function ($super, options) {
            this.setOption(function (k, v) {
                switch (k) {
                    case 'Months':
                    case 'date':
                    case 'curDate':
                    case 'root':
                    case 'callback':
                    case 'title':
                    case 'noabsolute':
                        this[k] = v;
                        break;
                    case 'cls':
                        this.cls.push(v);
                        break;
                    case 'validStartDate':
                    case 'validEndDate':
                        this[k] = v;
                        this[k].setHours(0, 0, 0, 0);
                        break;
                    case 'startMonth':
                        this[k] = v;
                        this[k].setDate(1);
                }
            });
            $super(options);
            this.buildEvent();
        },
        selectedDate: function () {
            var el;
            for (var i in this.date) {
                el = this.root.find('.' + this.buildSelectCls(i))[0];
                this.dateDoms[i] = el;
                this.dateVal[i] = this.date[i].value;
            }
            !this.curDate && (this.curDate = i);
        },
        buildEvent: function () {
            this.addEvent('onCreate', this.onCreate);
            this.addEvent('onShow', this.onShow);
            this.addEvent('onHide', this.onHide);
        },
        buildElement: function () {
            this.titledom = this.root.find('.calhead-title');
            this.leftback = this.root.find('.calhead-back');
        },
        onCreate: function () {
            this.selectedDate();
            this.buildElement();
            this.buildElementsEvent();
            if (!this.noabsolute) {
                this.root.css({
                    position: 'absolute'
                });
            }
            this.windowResizeHander = $.proxy(this.position, this);
        },
        onShow: function () {
            $(window).bind('resize', this.windowResizeHander);
            this.setzIndexTop();
            this.windowResizeHander();
            this.hashObserve.start();
        },
        position: function () {
            this.root.css({
                width: 'auto',
                height: 'auto',
                left: '0px',
                top: '0px',
            });
            var size = cUICore.Tools.getPageSize();
            this.root.css({
                width: size.width,
                height: size.height
            });
        },
        onHide: function () {
            $(window).unbind('resize', this.windowResizeHander);
            this.hashObserve.end();
        },
        createHtml: function () {
            return this.createCalendar();
        },
        buildElementsEvent: function () {
            var self = this;
            this.root.delegate('td.valid', 'click', function () {
                b = $(this);
                if (!b.hasClass('valid')) {
                    b = b.closest('.valid');
                }
                var date = cBase.Date.parse(b.attr('data-date')).valueOf();
                if (self.isAccordBound(date)) {
                    self._setDate(date, b);
                }
            });
            this.root.delegate('.calhead-back', 'click', $.proxy(function () {
                this.hide();
            }, this));
        },
        isAccordBound: function (date) {
            var curDateObj = this.date[this.curDate];
            if (!curDateObj.bound) return true;
            if (!curDateObj.bound.rules || !curDateObj.bound.error) return true;
            var rules = curDateObj.bound.rules, compare;

            for (var i in rules) {
                compare = typeof rules[i] === 'string' ? this.dateVal[rules[i]] : (cBase.Type.isDate(rules[i]) && rules[i]);
                date.setHours(0, 0, 0, 0);
                if (compare) {
                    compare.setHours(0, 0, 0, 0);
                    switch (i) {
                        case '<':
                            if (!(date < compare)) {
                                curDateObj.bound.error.call(this, date, this.curDate, this.dateVal);
                                return false;
                            }
                            break;
                        case '>':
                            if (!(date > compare)) {
                                curDateObj.bound.error.call(this, date, this.curDate, this.dateVal);
                                return false;
                            }
                            break;
                        case '<=':
                            if (!(date <= compare)) {
                                curDateObj.bound.error.call(this, date, this.curDate, this.dateVal);
                                return false;
                            }
                            break;
                        case '>=':
                            if (!(date >= compare)) {
                                curDateObj.bound.error.call(this, date, this.curDate, this.dateVal);
                                return false;
                            }
                            break;
                    }
                }
            }
            return true;
        },
        _setDate: function (date, el) {
            var rel = this.root.find('.' + this.buildSelectCls(this.curDate));
            if (rel.length) {
                rel.each($.proxy(function (k, v) {
                    var el = $(v);
                    el.html(this.formatTitle(cBase.Date.parse(rel.attr('data-date')).valueOf()));
                    el.removeClass(this.buildSelectCls(this.curDate));
                    el.removeClass(this.buildSelectCls());
                }, this));
                this.dateDoms[this.curDate] = el;
                var tel = $(el);
                var formatTitle,
                    self = this,
                    format = this.date[this.curDate].title;
                if (typeof format === 'function') {
                    formatTitle = this.formatTitle2(format);
                } else {
                    formatTitle = this.formatTitle;
                }
                tel.html(formatTitle.call(this, date));
                tel.addClass(this.buildSelectCls(this.curDate));
                tel.addClass(this.buildSelectCls());
                this.dateVal[this.curDate] = date;
                this.callback && this.callback.call(this, date, this.curDate, this.dateVal, this.getDateInfo(date),this.calendarend );
            }
        },
        setCurDate: function (curDate) {
            this.curDate = curDate;
            this.create();
            var title = this.getCurTitle();
            this.titledom.html(title);
        },
        getEndDate:function(){
            return this.calendarend;
        },
        buildSelectCls: function (suffix) {
            return suffix ? 'selected-' + suffix : 'selected';
        },
        getCurTitle: function () {
            var dateOption = this.date[this.curDate],
                title = '';
            if (dateOption) {
                title = dateOption.headtitle || this.title;
            }
            return title || this.title;
        },
        createCalendar: function () {
            var html = [],
                Month,
                title = this.getCurTitle();
            if (this.title) {
                html.push([
                    '<div class="calhead-box">',
                        '<div class="calhead-pad">',
                        '<div class="calhead-back"><span class="returnico"></span></div>',
                        '<div class="calhead-title">' + title + '</div>',
                        '</div>',
                    '</div>'
                ].join(''));
            }
            for (var i = 0; i < this.Months; i++) {
                Month = new Date(this.startMonth);
                Month.setMonth(Month.getMonth() + i);
                html.push(this.createMonth(Month));
            }
            return html.join('');
        },
        createMonth: function (month) {
            var data = this.calcStructData(month),
                mhtml = [],
                i;
            mhtml.push('<table class="calmonth">');
            mhtml.push('<tr class="clatitle"><th colspan="7">' + cBase.Date.format(month, 'Y年n月') + '</th></tr>');
            mhtml.push('<tr class="clahead">');
            for (i in this.DAYTITLE) {
                mhtml.push('<th>' + this.DAYTITLE[i] + '</th>');
            }
            mhtml.push('</tr>');
            var cls,
                self = this;
            for (var i = 0; i < data.days.length; i++) {
                mhtml.push('<tr class="clarow">');
                for (var t = 0; t < data.days[i].length; t++) {
                    cls = {};
                    if (data.days[i][t] >= data.start && data.days[i][t] <= data.end) {
                        cls['valid'] = true;
                    } else {
                        cls['invalid'] = true;
                    }
                    if (this.validStartDate) {
                        if (this.validStartDate > data.days[i][t]) {
                            delete cls['valid'];
                            cls['invalid'] = true;
                        }
                    }
                    if (this.validEndDate) {
                        if (this.validEndDate < data.days[i][t]) {
                            delete cls['valid'];
                            cls['invalid'] = true;
                        }
                    }
                    var formatTitle = this.formatTitle;
                    if (this.date) {

                        for (var o in this.date) {
                            if (cls['valid'] && cBase.Date.format((this.dateVal[o] || this.date[o].value), 'Y-m-d') == cBase.Date.format(data.days[i][t], 'Y-m-d')) {
                                cls[this.buildSelectCls()] = true;
                                cls[this.buildSelectCls(o)] = true;
                                formatTitle = this.formatTitle2(this.date[o].title);
                            }
                        }
                    }
                    mhtml.push('<td data-date="' + cBase.Date.format(data.days[i][t], 'Y-m-d') + '" ' + (cls ? ' class="' + cBase.Object.keys(cls).join(' ') + '"' : '') + '>' + formatTitle.call(this, data.days[i][t]) + '</td>');
                }
                mhtml.push('</tr>');
            }
            mhtml.push('</table>');
            return mhtml.join('');
        },
        formatTitle: function (date) {
            var info = this.getDateInfo(date);
            if (info.daytitle) return info.daytitle;
            if (info.holiday) return info.holiday;
            if (info.chineseday) return info.chineseday;
            return info.date;
        },
        getDateInfo: function (date) {
            var today = cUtility.getServerDate();
            var _date = new Date(date);
            _date.setHours(1, 1, 1, 0);
            today.setHours(1, 1, 1, 0);
            var day = (_date - today) / (3600000 * 24);
            var info = {};

            if (cBase.Date.format(today, 'Ymd') == cBase.Date.format(date, 'Ymd')) {
                info.daytitle = '今天';
            } else if (day == 1) {
                info.daytitle = '明天';
            } else if (day == 2) {
                info.daytitle = '后天';
            } else {
                info.daytitle = '';
            }
            var ckey = ChineseCalendar.solarDay2(date);
            if (this.chineseHoliday[ckey]) {
                info.chineseday = this.chineseHoliday[ckey];
            } else {
                info.chineseday = '';
            }
            var gkey = cBase.Date.format(date, 'md')
            if (this.holiday[gkey]) {
                info.holiday = this.holiday[gkey];
            } else {
                info.holiday = '';
            }
            info.week = this.DAYTITLE[date.getDay()];
            info.week2 = this.DAYTITLE2[date.getDay()];
            info.date = cBase.Date.format(date, 'j');
            return info;
        },
        formatTitle2: function (fun) {
            return $.proxy(function (date) {
                return fun(date, $.proxy(function (date) {
                    return this.formatTitle(date);
                }, this));
            }, this);
        },
        //计算这个月第一天和最后一天是周几
        calcStructData: function (month) {
            var st = new Date(month),
                et = new Date(month);
            st.setDate(1);
            st.setHours(0, 0, 0, 0);
            var startDay = st.getDay();
            et.setMonth(et.getMonth() + 1, 1);
            et.setHours(-24, 0, 0, 0);
            var endDay = et.getDay(),
                loops = (et.getDate() + (startDay + (6 - endDay))) / 7,
                rst = new Date(st),
                ret = new Date(et),
                days = [],
                temp;
            rst.setDate(rst.getDate() - startDay);
            ret.setDate(ret.getDate() + (6 - endDay));
            for (var i = 0, ii = 0; i < loops; i++) {
                days[i] = [];
                for (var t = 0; t < 7; t++) {
                    temp = new Date(rst);
                    temp.setDate(temp.getDate() + ii);
                    days[i].push(temp);
                    ii++;
                }
            }
            this.calendarend = et;
            return {
                start: st,
                end: et,
                days: days,
                loops: loops
            };
        },
        setDate: function (dates) {
            this.create();
            for (var i in dates) {
                if (this.date[i]) {
                    if (cBase.Type.isDate(dates[i])) {
                        dates[i].setHours(0, 0, 0, 0);
                        this.date[i].value = dates[i];
                        this.dateVal[i] = dates[i];
                        var el = this.root.find('.' + this.buildSelectCls(i));
                        if (el.length) {
                            var sdate = cBase.Date.parse(el.data('date')).valueOf();
                            el.removeClass(this.buildSelectCls(i));
                            el.removeClass(this.buildSelectCls());
                            el.html(this.formatTitle(sdate));
                        }
                        var cur = this.root.find('[data-date="' + cBase.Date.format(dates[i], 'Y-m-d') + '"]');
                        cur.each($.proxy(function (n, cur) {
                            cur = $(cur);
                            if (cur.hasClass('valid')) {
                                cur.addClass(this.buildSelectCls(i));
                                cur.addClass(this.buildSelectCls());
                                cur.html(this.formatTitle2(this.date[i].title)(dates[i]));
                            }
                        }, this));
                        this.dateDoms[i] = cur;
                    }
                }
            }
        },
        addDate: function (dates, overrive) {
            this.create();
            var date, title, dom;
            for (var i in dates) {
                if (!this.date[i] || overrive) {
                    this.date[i] = dates[i];
                    date = this.date[i] && this.date[i].value;
                    title = this.date[i] && this.date[i].title;
                    title = typeof title === 'function' ? this.formatTitle2(title) : $.proxy(this.formatTitle, this);
                    var el = this.root.find('.' + this.buildSelectCls(i));
                    if (el.length) {
                        el.removeClass(this.buildSelectCls(i));
                        el.removeClass(this.buildSelectCls());
                    }
                    if (date) {
                        dom = this.root.find('[data-date="' + cBase.Date.format(date, 'Y-m-d') + '"]');
                        dom.each($.proxy(function (n, dom) {
                            dom = $(dom);
                            if (dom.hasClass('valid')) {
                                dom.html(title(date));
                                dom.addClass(this.buildSelectCls(i));
                                dom.addClass(this.buildSelectCls());
                                this.dateVal[i] = date;
                            }
                        }, this));
                    }
                }
            }
        },
        removeDate: function (dates) {
            this.create();
            for (var t = 0, i, len = dates.length; t < len; t++) {
                i = dates[t];
                if (this.date[i]) {
                    var els = this.root.find('.' + this.buildSelectCls(i));
                    els.each($.proxy(function (k, v) {
                        var el = $(v);
                        el.removeClass(this.buildSelectCls(i));
                        el.removeClass(this.buildSelectCls());
                        el.html(this.formatTitle(cBase.Date.parse(el.data('date')).valueOf()));
                    }, this));
                    delete this.date[i];
                    delete this.dateVal[i];
                }
            }
        },
        getDate: function () {
            var data = {};
            for (var i in this.date) {
                data[i] = this.date[i].value;
            }
            return !_.isEmpty(this.dateVal) ? this.dateVal : (!_.isEmpty(data) ? data : {});
        },
        update: function (options) {
            this.setOption(function (k, v) {
                switch (k) {
                    case 'Months':
                    case 'date':
                    case 'curDate':
                    case 'root':
                    case 'callback':
                    case 'title':
                    case 'noabsolute':
                        this[k] = v;
                        break;
                    case 'cls':
                        this.cls.push(v);
                        break;
                    case 'validStartDate':
                    case 'validEndDate':
                        this[k] = v;
                        this[k].setHours(0, 0, 0, 0);
                        break;
                    case 'startMonth':
                        this[k] = v;
                        this[k].setDate(1);
                }
            });
            this.readOption(options);
            this.create();
            this.root.html(this.createCalendar());
            this.trigger('onChange');
        }
    });

    return Calendar;
});
