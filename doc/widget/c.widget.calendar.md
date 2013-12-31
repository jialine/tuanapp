# c.widget.abstract.calendar


### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.widget.abstract.calendar.png)

### 简单描述
该类用于提供Calendar与CalendarPrice继承

### Attribute

    // @param CONSTANT {object}             一些常量数据

### Method

**public setCalendarDate**

    // 设置日历日期
    setCalendarDate: function (dateObj) { ... }

**public leapMonth**

    // 传回农历 y年闰哪个月 1-12 , 没闰传回 0
    leapMonth: function (year) { ... }

**public monthDays**

    // 传回农历 y年m月的总天数
    monthDays: function (year, month) { ... }

**public leapDays**

    // 传回一年的天数
    leapDays: function (year, month) { ... }

**public lYearDays**

    // 传回某年的天数
    lYearDays: function (year) { ... }

**public Lunar**

    // 算出农历, 传入日期对象, 传回农历日期对象
    Lunar: function (DateObj) { ... }

**public cDay**

    // 中文日期
    cDay: function (m, d) { ... }

**public solarDay2**

    //
    solarDay2: function (date) { ... }

**public weekday**

    //
    weekday: function (date) { ... }

**public YYMMDD**

    // 返回规定格式的日期格式
    YYMMDD: function () { ... }


### 使用方法

    define(['cWidgetFactory', 'cWidgetAbstractCalendar'], function(WidgetFactory){
        var AbstractCalendar = WidgetFactory.create('Abstract.Calendar');
        var Calendar = new cBase.Class(AbstractCalendar, {});
    });

该类为抽象类，用于calendar与calendarPrice继承，本身不应该被实例化