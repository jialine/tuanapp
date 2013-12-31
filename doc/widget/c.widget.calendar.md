# c.widget.abstract.calendar


### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.widget.abstract.calendar.png)

### 简单描述
该类用于提供Calendar与CalendarPrice继承

### Attribute

    // @param Months {Number}                             显示几个月
    // @param date {Object}                               被选中时间
    // @param curDate {String}                            当前时间
    // @param root {Object}                               容器
    // @param callback {function}                         日期选择后的回调
    // @param title {String}                              标题
    // @param noabsolute {Boolean}                        定位方式是否绝对定位
    // @param msg {String}                                提示文字
    // @param clickEnabled {Boolean}                      是否可点击
    // @param cls {Object}                                类
    // @param validStartDate {Object}                     有效选择开始时间
    // @param validEndDate {Object}                       有效选择结束时间
    // @param startMonth {Object}                         开始月份

### Method

**public selectedDate**

    // 设置当前时间
    selectedDate: function () { ... }

**public buildEvent**

    //绑定view事件
    buildEvent: function () { ... }

**public buildElement**

    //指定DOM
    buildElement: function () { ... }

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

    //设置选择的日期
    _setDate: function (date, el) { ... }

**public setCurDate**

    //设置当前日期
    setCurDate: function (curDate) { ... }

**public getEndDate**

    //获得结束日期
    getEndDate: function () { ... }

**public buildSelectCls**

    //返回选择的类
    buildSelectCls: function (suffix) { ... }

**public getCurTitle**

    //获取当前标题
    getCurTitle: function () { ... }

**public createCalendar**

    //构造日历DOM结构
    createCalendar: function () { ... }

**public createWeek**

    //构造星期DOM结构
    createWeek: function (isApp) { ... }

**public createMonth**

    //构造月份DOM结构
    createMonth: function () { ... }

**public formatTitle**

    //返回日期的短名称
    formatTitle: function (date) { ... }

**public getDateInfo**

    //获取日期的详细信息
    getDateInfo: function (date) { ... }

**public formatTitle2**

    //返回函数环境下的日期短名称
    formatTitle2: function () { ... }

**public calcStructData**

    //计算这个月第一天和最后一天是周几
    calcStructData: function (month) { ... }

**public setDate**

    //设置出发时间或返程时间
    setDate: function (dates) { ... }

**public addDate**

    //增加出发时间或返程时间
    addDate: function (dates, overrive) { ... }

**public removeDate**

    //删除出发时间或返程时间
    removeDate: function (dates) { ... }

**public getDate**

    //获取出发时间和返程时间
    getDate: function () { ... }

**public getDate**

    //获取出发时间和返程时间
    getDate: function () { ... }


**public update**

    //更新当前对象
    update: function (options) { ... }


### 使用方法

    define([ 'cWidgetFactory', 'cWidgetCalendar'], function ( WidgetFactory) {
        var Calendar = WidgetFactory.create('Calendar');
        this.calendar = new Calendar({
            date:{
                start:{},
                back:{}
            },
            title:"",
            callback:function(){

            }

        })
    }

