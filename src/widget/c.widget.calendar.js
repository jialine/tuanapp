define(['cBase', 'cUIBase', 'cUIHashObserve', 'cUtility', 'cWidgetFactory', 'cWidgetAbstractCalendar'], function (cBase, Tools, HashObserve, cUtility, WidgetFactory) {
  "user strict";

  var WIDGET_NAME = 'Calendar';

  // 如果WidgetFactory已经注册了ListView，就无需重复注册
  if (WidgetFactory.hasWidget(WIDGET_NAME)) {
    return;
  }

  var AbstractCalendar = WidgetFactory.create('Abstract.Calendar');

  var Calendar = new cBase.Class(AbstractCalendar, {
    __propertys__: function () {
      this.chineseHoliday = this.CONSTANT.CALENDAR_CHINESE_HOLIDAY;
      this.holiday = this.CONSTANT.CALENDAR_COMMON_HOLIDAY;
      this.DAYTITLE = this.CONSTANT.CALENDAR_WEEKDAY_SHORTNAME;     //按周排布
      this.SDAYTITLE = this.CONSTANT.CALENDAR_WEEKDAY_SHORTNAME2;     //周短名称
      this.DAYTITLE2 = this.CONSTANT.CALENDAR_WEEKDAY_NAME;

      this.addClass(Tools.config.prefix + this.CONSTANT.CALENDAR);
      this.startMonth = cUtility.getServerDate();       //开始月份
      this.startMonth.setDate(this.CONSTANT.CALENDAR_INIT_DATE);
      this.Months = this.CONSTANT.CALENDAR_MONTH;       //显示几个月
      this.validStartDate = cUtility.getServerDate();     //有效选择开始时间
      this.validStartDate.setHours(this.CONSTANT.INIT_DATE_TIME.H, this.CONSTANT.INIT_DATE_TIME.M, this.CONSTANT.INIT_DATE_TIME.S, this.CONSTANT.INIT_DATE_TIME.MS);
      this.validEndDate;                  //有效选择结束时间
      this.date;                      //被选中时间
      this.dateVal = {};                  //时间值
      this.titledom;                    //titledom
      this.leftback;                    //leftback
      this.cls = [this.CONSTANT.CALENDAR];          //类
      this.title;                       //标题
      this.noabsolute = false;                //定位方式不是绝对定位
      this.curDate;                     //当前时间
      this.dateDoms = {};
      this.html;
      this.windowResizeHander;

      this.clickEnabled = true;
      this.msg = "";

      this.callback = function () {
      };
      this.hashObserve = new HashObserve({
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
          case 'msg':
          case 'clickEnabled':
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
    buildElement: function () {
      this.titledom = this.root.find('header');
      this.leftback = this.root.find('#js_return');
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
        top: '0px'
      });
      var size = Tools.getPageSize();
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
      if (this.clickEnabled) {
        this.root.delegate('.cui_cld_daybox li', 'click', function () {
          b = $(this);
          if (!b.hasClass('valid')) {
            b = b.closest('.valid');
          }
          var date = b.attr('data-date');
          if (date) {
            date = cBase.Date.parse(date).valueOf();
            if (self.isAccordBound(date)) {
              self._setDate(date, b);
            }
          } else {
            return;
          }
        });
      }

      this.root.delegate('#js_return', 'click', $.proxy(function () {
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
      //if (rel.length) {
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
      tel.removeClass('cui_cld_dayfuture');
      tel.removeClass('cui_cld_day_hint');
      tel.addClass('cui_cld_day_havetxt');
      tel.addClass(this.buildSelectCls(this.curDate));
      tel.addClass(this.buildSelectCls());
      this.dateVal[this.curDate] = date;
      this.callback && this.callback.call(this, date, this.curDate, this.dateVal, this.getDateInfo(date), this.calendarend);
      //}
    },
    setCurDate: function (curDate) {
      this.curDate = curDate;
      this.create();
      var title = this.getCurTitle();
      this.titledom.html(title);
    },
    getEndDate: function () {
      return this.calendarend;
    },
    buildSelectCls: function (suffix) {
      return suffix ? 'selected-' + suffix : 'cui_cld_daycrt';
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
                title = this.getCurTitle(),
                isInApp = cUtility.isInApp(),
                appStyle = isInApp ? ' style=" margin-top: 0"' : '';

      if (this.title && !isInApp) {
        html.push([
                    '<header>',
                    '<h1>' + title + '</h1><i class="returnico i_bef" id="js_return"></i>',
                    '</header>'
                ].join(''));
      }
      html.push([
                '<article class="cont_wrap"',
                appStyle,
                '><div class="cui_cldwrap">'
            ].join(''));

      html.push(this.createWeek(isInApp));
      for (var i = 0; i < this.Months; i++) {
        Month = new Date(this.startMonth);
        Month.setMonth(Month.getMonth() + i);
        html.push(this.createMonth(Month));
      }
      html.push([
                '</div></atricle>'
            ].join(''));
      return html.join('');
    },


    createWeek: function (isApp) {
      var appStyle = isApp ? ' cui_cldweek_top0' : '',
                whtml = ['<ul class="cui_cldweek' + appStyle + '">'];
      if (this.msg) {
        whtml.push('<p  class="cui_cldmsg">' + this.msg + '</p>');
      }
      for (i in this.SDAYTITLE) {
        whtml.push('<li>' + this.SDAYTITLE[i] + '</li>');
      }
      whtml.push('</ul>');
      return whtml.join('');
    },

    createMonth: function (month) {
      var data = this.calcStructData(month),
                mhtml = [],
                i;
      mhtml.push('<section class="cui_cldunit">');
      mhtml.push('<h1 class="cui_cldmonth">' + cBase.Date.format(month, 'Y年n月') + '</h1>');
      mhtml.push('<ul class="cui_cld_daybox">');

      var cls, wln,
                dln = data.days.length,
                self = this;
      for (var i = 0; i < dln; i++) {
        wln = data.days[i].length;
        for (var t = 0; t < wln; t++) {
          cls = {};
          //日期是否可用
          var tmpDate = data.days[i][t];
          if (tmpDate) {
            var start = this.validStartDate || data.start;
            var end = this.validEndDate || data.end;
            if (tmpDate >= start && tmpDate <= end) {
              //cls['cui_cld_dayfuture'] = true;
              cls['valid'] = true;
            } else {
              cls['cui_cld_daypass'] = true;
              cls['invalid'] = true;
            }
          } else {
            //为空时使用将来的样式
            cls['cui_cld_dayfuture'] = true;
            cls['invalid'] = true;
          }

          var title,
                        info = this.getDateInfo(tmpDate);
          if (info) {
            title = info.daytitle || info.holiday || info.chineseday;
            if (title) {
              cls['cui_cld_day_havetxt'] = true;
              if (info.holiday || info.chineseday) {
                cls['cui_cld_day_hint'] = true;
              }
              title = '<em>' + info.date + '</em><i>' + title + '</i>';
            } else {
              title = '<em>' + info.date + '</em>'; ;
            }
          } else {
            title = ""
          }
          if (this.date) {
            for (var o in this.date) {
              if (tmpDate && cBase.Date.format((this.dateVal[o] || this.date[o].value), 'Y-m-d') == cBase.Date.format(tmpDate, 'Y-m-d')) {
                delete cls['cui_cld_dayfuture'];
                delete cls['cui_cld_day_hint'];
                cls['cui_cld_day_havetxt'] = true;
                cls[this.buildSelectCls()] = true;
                cls[this.buildSelectCls(o)] = true;
                title = this.date[o].title(tmpDate, function () {
                  return info.daytitle || info.holiday || info.chineseday || info.date;
                });
                title = '<em>' + title + '</em>';
              }
            }
          }
          mhtml.push('<li data-date="' + cBase.Date.format(tmpDate, 'Y-m-d') + '" ' + (cls ? ' class="' + cBase.Object.keys(cls).join(' ') + '"' : '') + '>' + title + '</li>');
        }

      }
      mhtml.push('</ul></section>');
      return mhtml.join('');
    },

    formatTitle: function (date) {
      if (!date) {
        return "";
      } else {
        var info = this.getDateInfo(date);
        return info.holiday || info.chineseday || info.daytitle || info.date;
      }
    },
    getDateInfo: function (date) {
      if (!date) {
        return;
      }
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
      var ckey = this.solarDay2(date);
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
                days = [],
                temp;

      for (var i = 0, ii = 0; i < loops; i++) {
        days[i] = [];
        for (var t = 0; t < 7; t++) {

          if (i == 0 && t < startDay) {
            days[i].push("");
          } else {
            temp = new Date(st);
            temp.setDate(temp.getDate() + ii);
            if (temp > et) {
              break;
            } else {
              days[i].push(temp);
              ii++;
            }
          }
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

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: Calendar
  });

});