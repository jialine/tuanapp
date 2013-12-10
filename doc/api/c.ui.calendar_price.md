#c.ui.calendar_price

H5价格日历组件,继承自[c.ui.AbstractView](c.ui.core.md)和[cui.calendar.chinese](),
建议使用[c.widget.calendar.price](c.widget.calendar.price.md)替代.

     var calendar = new Calendar_Price({
        date: {
            start: {
                title: function (date, sformat) {
                    return sformat(date);
                }
                ,
                value: selectedDate
                /*bound: {
                rules: { '<': 'end' },
                error: function () {
                alert('请选择比结束时间更早的时间')
                }*/
            }
        },
        validEndDate: endDate,
        curDate: 'start',
        Months: months,
        validDates: dateList,
        showChineseHoliday: true,
        showHoliday: true,
        callback: function (date, price, timename, any) {


        }
    });

## Properties 属性

### showChineseHoliday
是否显示中国农历节日,默认为true

### showHoliday
是否显示节假日,默认为true

### onlyread
是否为只读模式,默认为false

### formatPrice
价格的格式化函数

### validDates
包含价格和日期的一个数组,格式如

    [
        {
            date : date1, //Date类型
            price: '50'
        },
        {
            date : date2, //Date类型
            price: '520'
        },
    }

### startMonth
    开始月份,默认使用服务器时间

### Months
    显示几个月份,默认显示5个月
### validStartDate
    有效开始时间,服务器下发的时间到
### validEndDate
    有效结束时间
### date
 为Calender指定一系列状态,每种状态都可以自己的标题,点击响应,选中值,此参数接受一个JSON对象.
 该对象的每个属性名都对应了一种状态

    date: {
        start: {    //此状态名为start
            headtitle: '出发日期选择', // 此状态的title
            title: function (date, sformat) {
                var str = '<em style="font-size:10px;">出发日期</em><i>' + sformat(date)+'</i>';
                return str;
            },                     //点击日期时,该日期显示的标题格式,data为日期期,sformat 为格式化函数
            value: dTime           //默认选中日期
        },
        back: {
            headtitle: '返程日期选择',
            title: function (date, sformat) {
                var str = '<em style="font-size:10px;">返程日期</em><i>' + sformat(date)+'</i>';
                return str;
            },
            value: eTime,
            bound: {                            //选择的规则
                rules: { '>': 'start' },        //追规则设定
                error: function () {            //出错时的处理函数
                    self.showToast('请选择比出发日期更晚的时间', 1);
                }
            }
        }
    }
### callback
   callback()

   点击日历项后回调

## Event 事件

### onShow

 组件显示后触发

### onHide

 组件隐藏后触发

## Method 方法

### show
show()

将Calendar显示出来,如此前Calendar未生成,则自动调用create()方法

    calender.show()

###  hide
hide()

将Calender隐藏

    clender.hide()

### remove
remove()

将Calendar的删除
