# c.base

提供一些基本的js扩展功能,如模拟类的继承,自定义了一些基础类

# Class

Class(supClass,subProperty) ==> Object

实现类的继承,子类subProperty有两个继承的__propertys__和initialize.__propertys__中定义子类的属性,initialize显示调用父类的构造函数

    var.UserStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'USER';
            this.lifetime = '1D';
        },
        initialize: function ($super, options) {
            $super(options);
        },
    });
### __propertys__

初始化方法,定义子类的属性

### initialize
构造函数实际调用点，其中的参数options便是构造函数传入的参数，在此方法中完成一些初始化操作
子类须显示调用

### getInstance

获得Class对象的实例,内部实现了单例模式

### getServerDate

获得服务器时间


# C.Object
H5扩展的Object类型

## Method

### keys
keys(Object)

返回Object的所有属性数组

    var data = {name :'张三'}
    C.Object.keys(data) ==> ['name']


# C.Date类

H5扩展的Date类型

    var date = new C.Date();

## Method

### addDay
addDay(n)

在当前时期值上增加n天

    date.addDay(1);

### addMonth
addMonth(n)
当前时间加n月

    date.addMonth(1);

### addHours
addHours(n)
 当前时间加n个小时

    date.addHours(1);

### addMinutes
addMinutes(n)
当前时间加n分种

    date.addMinutes(30)

### addSeconds
addSeconds(n)
当前时间加n秒

    date.addSeconds(30)

### addYear
addYear(n)
当前时间加n年

    date.addYear(1)

###  setHours
setHours([hour],[min],[sec])
设置当前时间的小时，分，秒

    date.setHours(0,0,0)

### valueOf
valueOf()
获得原生的Date对象

    var d2 = date.valueOf();

### getTime
getTime()

获得毫秒值

    var time = date.getTime();

### diffMonth
diffMonth(month)
返回两个月份之间的间隔

### format
format(formatString)
格式化后的日期字符串,格式化参数请参考php中date函数说明

### parse
parse(dateStr)
解析日期字符

    C.Date.parse('2012/03/12 00:12:23')

### getHM
getHM(date)
返回hh:mm格式的数据

    C.Date.getHM(date);

### getIntervalDay
getIntervalDay(date1,date2)
返回两个日期相差多少天

    C.Date.getIntervalDay(date1,date2);

### m2H
m2H(min)
格式化分钟,返回如"5小时:32分钟"的格式.

     C.Date.m2H(232);

### weekday
weekday(date)
返回date为周几,格式如["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

     C.Date.m2H(date);

### diffMonth
diffMonth(date1,date2)
计算两个时间的相隔月份数

     C.Date.diffMonth(date1,date2);
# C.Hash 类
javascript模拟的Hash容器

## Method


