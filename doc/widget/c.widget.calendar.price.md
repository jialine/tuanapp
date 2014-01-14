#c.widget.calendar.price
##描述
带有价格的日历组件，用于日期选择。同时可以支持选择往返2个日期。

##属性

###date
类型：Date

###chineseHoliday
类型：数组

中国农历节日

###holiday
类型：数组

中国西方公共节日

###DAYTITLE
类型：数组

星期标题

###SDAYTITLE
类型：数组

星期短标题

###showChineseHoliday
类型：boolean

是否显示中国农历

###startMonth
类型：数值

开始月份

###Months 
类型：数值

当前组件显示多少个月

###validStartDate
类型：Date

有效选择开始时间

###validEndDate
类型：Date

有效选择结束日期

###date
类型：Date

被选中的日期

###onlyread
类型：boolean
组件是否只读

###dateVal
类型：Object

时间值

###cls
类型：Array

类

###title
类型：String

标题

###noabsolute
类型：boolean

css定位方式是否是绝对定位

###curDate
类型：Date

当前时间

###dateDoms
类型：Object

时间Dom

###html
类型：String

html

###windowResizeHander
类型：Function

window resize事件句柄

###callback
类型：Function

日志选择后执行的方法


##方法

###initialize
初始化方法

###selectedDate
设置当前时间

###buildEvent
绑定view事件

###buildElement
指定Dom

###buildElementEvent
Dom事件绑定 日期选择，返回

###onCreate
View第一次载入时调用,在声明周期只调用一次.一般在此方法中保存dom元素的引用.

###onShow
view显示后调用的方法

###position
设置容器信息

###createHtml
返回：function

###isAccordBound
isAccorcdBound(date: Date)
返回：boolean

检测选择的事件是否生效（在范围内）

###setCurDate
setCurDate(surDate : Date) 

设置选择的日期并回调

###buildSelectCls
buildSelectCls(suffix: String)
返回String

返回选择类

###createCalendar
返回String

构造日历Dom结构

###createWeek
createWeek(isApp: boolean)
返回String

构造星期Dom结构

###createMonth
createMonth(date: Date)
返回String

构造月份Dom结构

###formateTitle
formateTitle(date: Object)
返回Array

返回日期的名称


###formatePrice
formatePrice(price: number)
返回String

###calcStructDate
calcStructDate(month: Date)

计算这个月第一天和最后一天是周几

###setDate
setDate(dates: Object)

###getDate

获取出发时间或者返程时间

###update
update(options: Object)

更新当前对象

##例子


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












    

