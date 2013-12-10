/* File Created: 六月 23, 2013 */

define(['cBase', 'cUICore', 'cChineseCal', 'cUtility'], function (cBase, cUICore, ChineseCalendar, cUtility) {
    var Calendar_Price = new cBase.Class(cUICore.AbstractView, {
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
            this.addClass(cUICore.config.prefix + 'calendar');
            //是否显示农历
            this.showChineseHoliday = true;
            //是否显示节假日
            this.showHoliday = true;
            //开始月份
            this.startMonth = cUtility.getServerDate();
            this.startMonth.setDate(1);
            //显示几个月
            this.Months = 5;
            //有效选择开始时间
            this.validStartDate = cUtility.getServerDate();
            this.validStartDate.setHours(1, 1, 1, 0);
            //有效选择结束时间
            this.validEndDate;
            //被选中时间
            this.date;
            //格式化价格
            this._formatPrice = function (price, sformat) {
                return sformat(price);
            };
            //是否只读
            this.onlyread = false;
            //时间值
            this.dateVal = {};
            //类
            this.cls = ['calenar'];
            this.callback = function () { };
            //当前时间
            this.curDate;
            this.dateDoms = {};
            this.html;
            this.windowResizeHander;
        },
        initialize: function ($super, options) {
            this.setOption(function (k, v) {
                switch (k) {
                    case 'Months':
                    case 'curDate':
                    case 'root':
                    case 'callback':
                    case 'onlyread':
                    case 'showChineseHoliday':
                        this[k] = v;
                        break;
                    case 'date':
                        if (v) {
                            for (var i in v) {
                                this.dateVal[i] = v[i].value;
                            }
                        }
                        this[k] = v;
                        break;
                    case 'formatPrice':
                        this._formatPrice = v;
                        break;
                    case 'showHoliday':
                        this[k] = v;
                        break;
                    case 'validDates':
                        this[k] = v;
                        break;
                    case 'cls':
                        this.cls.push(v);
                        break;
                    case 'validStartDate':
                    case 'validEndDate':
                        this[k] = v;
                        this[k].setHours(1, 1, 1, 0);
                        break;
                    case 'startMonth':
                        this[k] = v;
                        this[k].setDate(1);
                        break;
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
        onCreate: function () {
            this.selectedDate();
            this.buildElementsEvent();
            this.root.css({
                position: 'absolute'
            });
            this.windowResizeHander = $.proxy(this.position, this);
        },
        onShow: function () {
            $(window).bind('resize', this.windowResizeHander);
            this.setzIndexTop();
            this.windowResizeHander();
        },
        position: function () {
            this.root.css({
                width: 'auto',
                height: 'auto',
                left: '0px',
                top: '0px'
            });

            var size = cUICore.Tools.getPageSize();
            this.root.css({
                left: '0px',
                top: '0px',
                width: size.width,
                height: size.height
            });
        },
        onHide: function () {
            $(window).unbind('resize', this.windowResizeHander);
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
        },
        isAccordBound: function (date) {
            var curDateObj = this.date[this.curDate];
            if (!curDateObj.bound) return true;
            if (!curDateObj.bound.rules || !curDateObj.bound.error) return true;
            var rules = curDateObj.bound.rules, compare;

            for (var i in rules) {
                compare = typeof rules[i] === 'string' ? this.dateVal[rules[i]] : (cBase.Type.isDate(rules[i]) && rules[i]);
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
            return true;
        },
        _setDate: function (date, el) {
            if (this.onlyread) return;
            if (this.dateDoms[this.curDate]) {
                var rel = $(this.dateDoms[this.curDate]);

                rel.html(this.formatTitle(cBase.Date.parse(rel.attr('data-date')).valueOf()));
                rel.removeClass(this.buildSelectCls(this.curDate));
                rel.removeClass(this.buildSelectCls());
            }
            this.dateDoms[this.curDate] = el;
            var tel = $(el);
            var formatTitle,
                    self = this,
                    format = this.date[this.curDate].title;
            if (typeof format === 'function') {
                formatTitle = function (date) {
                    return format(date, function (date) {
                        return self.formatTitle(date);
                    });
                };
            } else {
                formatTitle = this.formatTitle;
            }
            var price = parseFloat(parseInt((el.attr('data-price') || 0)*100)/100),
                formatPrice = $.proxy(this.formatPrice, this);
            tel.html(formatTitle.call(this, date) + this._formatPrice(price, formatPrice, true));
            tel.addClass(this.buildSelectCls(this.curDate));
            tel.addClass(this.buildSelectCls());
            this.dateVal[this.curDate] = date;

            var arr = $.grep(this.validDates, function (n, i) {
                var b = (n.date.valueOf() == date.valueOf());
                return b;
            });
            var price = 0;
            if (arr.length > 0) {
                price = arr[0].price;
            }

            var dayname = tel.html().replace(/^\d+/mg,'');
            if (isNaN(dayname) === false) {
                dayname = this.DAYTITLE[date.getDay()];
            }
            this.callback && this.callback.call(this, date, price, dayname, this.dateVal);
            //this.callback && this.callback.call(this, date, price, this.curDate, this.dateVal);

        },
        setCurDate: function (curDate) {
            this.curDate = curDate;
        },
        buildSelectCls: function (suffix) {
            return suffix ? 'selected-' + suffix : 'selected';
        },
        createCalendar: function () {
            var html = [],
                Month;
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
                    //console.log(data.days[i][t]);//debug
                    if (data.days[i][t] >= data.start && data.days[i][t] <= data.end) {
                        cls['valid'] = true;
                    } else {
                        cls['invalid'] = true;
                        cls['none'] = true;
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
                    var price = '';
                    if (this.validDates) {
                        var thisDate = data.days[i][t];
                        var arr = $.grep(this.validDates, function (n, i) {
                            if (n.date.getFullYear() === thisDate.getFullYear() &&
                            n.date.getMonth() === thisDate.getMonth() &&
                            n.date.getDate() === thisDate.getDate()) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        if (arr.length === 0) {
                            delete cls['valid'];
                            cls['invalid'] = true;
                        }
                        else {
                            price = arr[0].price;
                        }
                    }
                    var formatTitle = this.formatTitle;
                    if (this.date) {

                        for (var o in this.date) {
                            if (this.dateVal[o] && cls['valid'] && cBase.Date.format((this.dateVal[o] || this.date[o].value), 'Y-m-d') == cBase.Date.format(data.days[i][t], 'Y-m-d')) {
                                cls[this.buildSelectCls()] = true;
                                cls[this.buildSelectCls(o)] = true;
                                formatTitle = (function (fun) {
                                    return function (date) {
                                        return fun(date, function (date) {
                                            return self.formatTitle(date);
                                        });
                                    }
                                })(this.date[o].title);
                            }
                        }
                    }
                    var formatPrice = $.proxy(this.formatPrice, this);
                    mhtml.push('<td data-price="' + price + '" data-date="' + cBase.Date.format(data.days[i][t], 'Y-m-d') + '" ' + (cls ? ' class="' + cBase.Object.keys(cls).join(' ') + '"' : '') + '>' + formatTitle.call(this, data.days[i][t]) + this._formatPrice(price, formatPrice, !!cls['valid']) + '</td>');
                }
                mhtml.push('</tr>');
            }
            mhtml.push('</table>');
            return mhtml.join('');
        },
        formatPrice: function (price) {
            //如果价格=0，则不显示价格
            return price > 0 ? '<i>&yen;' + price + '</i>' : '';
        },
        formatTitle: function (date) {
            var today = cUtility.getServerDate();
            if (cBase.Date.format(today, 'Ymd') == cBase.Date.format(date, 'Ymd')) {
                return '今天';
            }
            var _date = new Date(date);
            _date.setHours(1, 1, 1, 0);
            today.setHours(1, 1, 1, 0);
            var day = (_date - today) / (3600000 * 24);
            if (day == 1) {
                return '明天';
            }
            if (day == 2) {
                return '后天';
            }
            //是否显示农历
            if (this.showChineseHoliday == true) {
                var ckey = ChineseCalendar.solarDay2(date);
                if (this.chineseHoliday[ckey]) {
                    return this.chineseHoliday[ckey];
                }
            }
            //是否显示节假日
            if (this.showHoliday == true) {
                var gkey = cBase.Date.format(date, 'md')
                if (this.holiday[gkey]) {
                    return this.holiday[gkey];
                }
            }
            return cBase.Date.format(date, 'j');
        },
        //计算这个月第一天和最后一天是周几
        calcStructData: function (month) {
            var st = new Date(month),
                et = new Date(month);
            st.setDate(1);
            st.setHours(1, 1, 1, 0);
            var startDay = st.getDay();
            et.setMonth(et.getMonth() + 1, 1);
            et.setHours(-23, 1, 1, 0);
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
            return {
                start: st,
                end: et,
                days: days,
                loops: loops
            };
        },
        setDate: function (dates) {
            for (var i in dates) {
                if (this.date[i]) {
                    if (cBase.Type.isDate(dates[i])) {
                        dates[i].setHours(1, 1, 1, 0);
                        this.date[i].value = dates[i];
                        this.dateVal[i] = dates[i];
                        var el = $(this.dateDoms[i]);
                        el.removeCls(this.buildSelectCls(i));
                        el.removeCls(this.buildSelectCls());
                        var cur = $(this.root.query('[data-date="' + cBase.Date.format(dates[i], 'Y-m-d') + '"]')[0]);
                        if (cur.hasClass('valid')) {
                            cur.addClass(this.buildSelectCls(i));
                            cur.addClass(this.buildSelectCls());
                        }
                        this.dateDoms[i] = cur;
                    }
                }
            }
        },
        getDate: function () {
            return this.dateVal;
        }
    });

    return Calendar_Price
});