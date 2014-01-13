define(['cCoreInherit', 'cBusinessServertime'], function (inherit, cBusinessServertime) {
    var C = function() {};

    /* Date对象，对时间提供一些常用方法 */
    C.Date = new inherit.Class({
        initialize: function (date) {
            date = date || new Date();
            this.date = new Date(date);
        },
        /**
        * 当前时间加n天
        * @param {Number} n
        * @returns {C.Date}
        */
        addDay: function (n) {
            n = n || 0;
            this.date.setDate(this.date.getDate() + n);
            return this;
        },
        /**
        * 当前时间加n月
        * @param {Number} n
        * @returns {C.Date}
        */
        addMonth: function (n) {
            n = n || 0;
            this.date.setMonth(this.date.getMonth() + n);
            return this;
        },
        /**
        * 当前时间加n个小时
        * @param {Number} n
        * @returns {C.Date}
        */
        addHours: function (n) {
            n = n || 0;
            this.date.setHours(this.date.getHours() + n);
            return this;
        },
        addMinutes: function (n) {
            n = n || 0;
            this.date.setMinutes(this.date.getMinutes() + n);
            return this;
        },
        addSeconds: function (n) {
            n = n || 0;
            this.date.setSeconds(this.date.getSeconds() + n);
            return this;
        },

        /**
        * 当前时间加n年
        * @param {Number} n
        * @returns {C.Date}
        */
        addYear: function (n) {
            n = n || 0;
            this.date.setYear(this.date.getFullYear() + n);
            return this;
        },
        /**
        * 设置当前时间的小时，分，秒
        */
        setHours: function () {
            this.date.setHours.apply(this.date, arguments);
            return this;
        },
        //获得原生Date对象
        valueOf: function () {
            return this.date;
        },
        //获得毫秒数
        getTime: function () {
            return this.date.valueOf();
        },
        //获得utc时间字符串
        toString: function () {
            return this.date.toString();
        },
        /**
        * 格式化时间,格式化参数请参考php中date函数说明
        * @param {String} format
        * @returns {String}
        * @see http://www.php.net/manual/zh/function.date.php
        */
        format: function (format) {
            typeof format != 'string' && (format = '');
            for (var key in this._MAPS) {
                format = this._MAPS[key].call(this, format, this.date, key);
            }
            return format;
        },
        /**
        * 返回输入Date的相差的月份数
        * @param {Date} 要计算的时间
        * @return {Number} 月数
        */
        diffMonth: function (date) {
            var curY = parseInt(this.format('Y')),
                curM = parseInt(this.format('m')),
                cdate = new C.Date(date),
                cdateY = parseInt(cdate.format('Y')),
                cdateM = parseInt(cdate.format('m'));
            return (cdateY - curY) * 12 + (cdateM - curM);
        },
        //星期数据
        _DAY1: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        _DAY2: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        //时间格式化函数集
        _MAPS: {
            //有前导零的日期值
            'd': function (str, date, key) {
                var d = date.getDate().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //无前导零的日期值
            'j': function (str, date, key) {
                return str.replace(new RegExp(key, 'mg'), date.getDate());
            },
            //星期中的第几天 1-7
            'N': function (str, date, key) {
                var d = date.getDay();
                d == 0 && (d = 7);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            'w': function (str, date, key) {
                var d = date.getDay();
                var title = this._DAY1[d];
                return str.replace(new RegExp(key, 'mg'), title);
            },
            'W': function (str, date, key) {
                var d = date.getDay();
                var title = this._DAY2[d];
                return str.replace(new RegExp(key, 'mg'), title);
            },
            //有前导零的月份
            'm': function (str, date, key) {
                var d = (date.getMonth() + 1).toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //无前导零的月份
            'n': function (str, date, key) {
                return str.replace(key, date.getMonth() + 1);
            },
            //四位年份
            'Y': function (str, date, key) {
                return str.replace(new RegExp(key, 'mg'), date.getFullYear());
            },
            //两位年份
            'y': function (str, date, key) {
                return str.replace(new RegExp(key, 'mg'), date.getYear());
            },
            //无前导零的小时,12小时制
            'g': function (str, date, key) {
                var d = date.getHours();
                d >= 12 && (d = d - 12);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //无前导零的小时，24小时制
            'G': function (str, date, key) {
                return str.replace(new RegExp(key, 'mg'), date.getHours());
            },
            //有前导零的小时，12小时制
            'h': function (str, date, key) {
                var d = date.getHours();
                d >= 12 && (d = d - 12);
                d += '';
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //有前导零的小时，24小时制
            'H': function (str, date, key) {
                var d = date.getHours().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //有前导零的分钟
            'i': function (str, date, key) {
                var d = date.getMinutes().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //有前导零的秒
            's': function (str, date, key) {
                var d = date.getSeconds().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //无前导零的分钟
            'I': function (str, date, key) {
                var d = date.getMinutes().toString();
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //无前导零的秒
            'S': function (str, date, key) {
                var d = date.getSeconds().toString();
                return str.replace(new RegExp(key, 'mg'), d);
            },
            //转换为今天/明天/后天
            'D': function (str, date, key) {
                var now = cBusinessServertime.getServerDate();
                now.setHours(0, 0, 0, 0);
                date = new Date(date.valueOf());
                date.setHours(0, 0, 0, 0);
                var day = 60 * 60 * 24 * 1000,
                    tit = '',
                    diff = date - now;
                if (diff >= 0) {
                    if (diff < day) {
                        tit = '今天';
                    } else if (diff < 2 * day) {
                        tit = '明天';
                    } else if (diff < 3 * day) {
                        tit = '后天';
                    }
                }
                return str.replace(new RegExp(key, 'mg'), tit);
            }
        }
    });
    inherit.extend(C.Date, {
        /**
        * 将字符串转换为CT.Date对象
        * @param {String} str
        * @returns {C.Date}
        */
        parse: function (str, isNative) {
            if (typeof str === 'undefined') { return new Date(); }
            if (typeof str === 'string') {
                str = str || '';
                var regtime = /^(\d{4})\-?(\d{1,2})\-?(\d{1,2})/i;
                if (str.match(regtime)) { str = str.replace(regtime, "$2/$3/$1"); }
                var st = Date.parse(str);
                var t = new Date(st || new Date());
                return isNative ? t : new C.Date(t);
            } else if (typeof str === 'number') {
                return new Date(str);
            } else {
                return new Date();
            }
        },

        /**
        * 返回HH：MM格式
        */
        getHM: function (timeStr) {
            var d = this._getDate(timeStr);
            var h = d.getHours();
            var m = d.getMinutes();
            return (h < 10 ? '0' + h : '' + h) + ':' + (m < 10 ? '0' + m : '' + m);
        },

        getIntervalDay: function (ds1, ds2) {
            var d1 = this._getDate(ds1);
            var d2 = this._getDate(ds2);
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
            return parseInt((d2 - d1) / 86400000);
        },

        m2H: function (min) {
            var h = Math.floor(min / 60);
            var m = min % 60;
            return (h > 0 ? h + '小时' : '') + (m > 0 ? m + '分钟' : '');
        },

        _getDate: function (ds) {
            var t = C.Date.parse(ds, true);
            var d = new Date();
            d.setTime(t);
            return d;
        },

        format: function (obj, str) {
            return new C.Date(obj).format(str);
        },
        //获取周几，d为日期C.parse(d);
        weekday: function (d) {
            var day = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            var dd = new Date(d);
            return day[dd.getDay()];
        },
        //计算两个时间的相隔月份数
        diffMonth: function (d1, d2) {
            var d1 = new C.Date(d1);
            return d1.diffMonth(d2);
        }
    });	

    return C.Date;
});