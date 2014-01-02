# c.widget.abstract.calendar

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.widget.calendar.png)

### 简单描述
该类用于提供Calendar与CalendarPrice继承

### Attribute

    // @param CONSTANT {object}             一些常量数据
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

    define(['cWidgetFactory', 'cWidgetCalendar'], function(WidgetFactory){
        var Calendar = WidgetFactory.create('Calendar');
        var c = new Calendar({

        });
    });

该类为抽象类，用于calendar与calendarPrice继承，本身不应该被实例化