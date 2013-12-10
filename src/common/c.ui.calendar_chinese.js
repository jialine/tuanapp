﻿/* File Created: 六月 23, 2013 */
define([], function () {
    var ChineseCalendar = function (dateObj) {
        this.dateObj = (dateObj != undefined) ? dateObj : new Date();
        this.SY = this.dateObj.getFullYear();
        this.SM = this.dateObj.getMonth();
        this.SD = this.dateObj.getDate();
        this.lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
            0x14b63];

        //传回农历 y年闰哪个月 1-12 , 没闰传回 0
        this.leapMonth = function (y) {
            return this.lunarInfo[y - 1900] & 0xf;
        };
        //传回农历 y年m月的总天数
        this.monthDays = function (y, m) {
            return (this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
        };
        //传回农历 y年闰月的天数
        this.leapDays = function (y) {
            if (this.leapMonth(y)) {
                return (this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
            } else {
                return 0;
            }
        };
        //传回农历 y年的总天数
        this.lYearDays = function (y) {
            var i,
            sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) {
                sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
            }
            return sum + this.leapDays(y);
        };
        //算出农历, 传入日期对象, 传回农历日期对象
        //该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
        this.Lunar = function (dateObj) {
            var i,
            leap = 0,
            temp = 0,
            lunarObj = {};
            var baseDate = new Date(1900, 0, 31);
            var offset = (dateObj - baseDate) / 86400000;
            lunarObj.dayCyl = offset + 40;
            lunarObj.monCyl = 14;
            for (i = 1900; i < 2050 && offset > 0; i++) {
                temp = this.lYearDays(i);
                offset -= temp;
                lunarObj.monCyl += 12;
            }
            if (offset < 0) {
                offset += temp;
                i--;
                lunarObj.monCyl -= 12;
            }

            lunarObj.year = i;
            lunarObj.yearCyl = i - 1864;
            leap = this.leapMonth(i);
            lunarObj.isLeap = false;
            for (i = 1; i < 13 && offset > 0; i++) {
                if (leap > 0 && i == (leap + 1) && lunarObj.isLeap == false) {
                    --i;
                    lunarObj.isLeap = true;
                    temp = this.leapDays(lunarObj.year);
                } else {
                    temp = this.monthDays(lunarObj.year, i)
                }
                if (lunarObj.isLeap == true && i == (leap + 1)) {
                    lunarObj.isLeap = false;
                }
                offset -= temp;
                if (lunarObj.isLeap == false) {
                    lunarObj.monCyl++;
                }
            }

            if (offset == 0 && leap > 0 && i == leap + 1) {
                if (lunarObj.isLeap) {
                    lunarObj.isLeap = false;
                } else {
                    lunarObj.isLeap = true;
                    --i;
                    --lunarObj.monCyl;
                }
            }

            if (offset < 0) {
                offset += temp;
                --i;
                --lunarObj.monCyl
            }
            lunarObj.month = i;
            lunarObj.day = offset + 1;
            return lunarObj;
        };
        //中文日期
        this.cDay = function (m, d) {
            var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            var nStr2 = ['初', '十', '廿', '卅', '　'];
            var s;
            if (m > 10) {
                s = '十' + nStr1[m - 10];
            } else {
                s = nStr1[m];
            }
            s += '月';
            switch (d) {
                case 10:
                    s += '初十';
                    break;
                case 20:
                    s += '二十';
                    break;
                case 30:
                    s += '三十';
                    break;
                default:
                    s += nStr2[Math.floor(d / 10)];
                    s += nStr1[d % 10];
            }
            return s;
        };
        this.solarDay2 = function () {
            var sDObj = new Date(this.SY, this.SM, this.SD);
            var lDObj = this.Lunar(sDObj);
            var tt = (lDObj.month >= 10 ? lDObj.month : '0' + lDObj.month) + "" + (lDObj.day >= 10 ? lDObj.day : '0' + lDObj.day);
            lDObj = null;
            return tt;
        };
        this.weekday = function () {
            var day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            return day[this.dateObj.getDay()];
        };
        this.YYMMDD = function () {
            var dateArr = [this.SY, '年', this.SM + 1, '月', this.SD, '日'];
            return dateArr.join('');
        }
    };
    ChineseCalendar.instance = new ChineseCalendar(new Date());
    ChineseCalendar.solarDay2 = function (date) {
        if (!date) return;
        var SY = date.getFullYear();
        var SM = date.getMonth();
        var SD = date.getDate();
        var sDObj = new Date(SY, SM, SD);
        var lDObj = ChineseCalendar.instance.Lunar(sDObj);
        var tt = (lDObj.month >= 10 ? lDObj.month : '0' + lDObj.month) + "" + (lDObj.day >= 10 ? lDObj.day : '0' + lDObj.day);
        lDObj = null;
        return tt;
    };

    return ChineseCalendar;

});