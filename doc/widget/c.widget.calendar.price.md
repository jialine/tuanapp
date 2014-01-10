# c.widget.calendar.price


### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.widget.calendar.price.png)

### 简单描述
该类用于创建日历，支持实时价格

### Attribute

    // @param Months {Number}                               显示几个月
    // @param date {Object}                                 被选中时间
    // @param curDate {String}                              当前时间    start
    // @param root {dom}                                    容器
    // @param callback {function}                           日期选择后的回调
    // @param onlyread  {Boolean}                           是否只读
    // @param showChineseHoliday {Boolean}                  是否显示农历
    // @param formatPrice {function}                        格式化价格
    // @param showHoliday {Boolean}                         是否显示节假日
    // @param validDates {Array}                            价格有效时间
    // @param cls {dom}                                     类
    // @param validStartDate {Object}                       有效选择开始时间
    // @param validEndDate {Object}                         有效选择结束时间
    // @param startMonth {Object}                           开始月份

### Method


**public selectedDate**

    // 设置当前时间
    selectedDate: function () { ... }

**public buildEvent**

    //绑定view事件
    buildEvent: function () { ... }

**public position**

    //设置容器信息
    position: function () { ... }

**public buildElementsEvent**

    //DOM事件绑定 日期选择，返回
    buildElementsEvent: function () { ... }

**public isAccordBound**

    //检测选择的时间是否有效（在范围内）
    isAccordBound: function (date) { ... }

**public _setDate**

    //设置选择的日期并回调
    _setDate: function (date, el) { ... }

**public setCurDate**

    //设置当前日期
    setCurDate: function (curDate) { ... }

**public buildSelectCls**

    //返回选择的类
    buildSelectCls: function (suffix) { ... }

**public createCalendar**

    //构造日历DOM结构
    createCalendar: function () { ... }

**public createWeek**

    //构造星期DOM结构
    createWeek: function (isApp) { ... }

**public createMonth**

    //构造月份DOM结构
    createMonth: function () { ... }

**public formatPrice**

    //格式化价格
    formatPrice: function (date) { ... }


**public formatTitle**

    //返回日期的短名称
    formatTitle: function (date) { ... }


**public calcStructData**

    //计算这个月第一天和最后一天是周几
    calcStructData: function (month) { ... }

**public setDate**

    //设置出发时间或返程时间
    setDate: function (dates) { ... }

**public getDate**

    //获取出发时间和返程时间
    getDate: function () { ... }


### 使用方法

    define([ 'cWidgetFactory', 'cWidgetCalendar'], function ( WidgetFactory) {
        var Calendar_Price = WidgetFactory.create('Calendar.Price');
        this.calendar = new Calendar_Price({
            date:{
                start:{}
            },
            curDate: 'start',
            validDates: [],
            title:"",
            callback:function(){

            }

        })
    }
    该方法继承自c.widget.abstract.calendar，用于显示实时价格

