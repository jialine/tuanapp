# c.ui.calendar

H5日历组件,继承自[c.ui.AbstractView](c.ui.core.md)和[cui.calendar.chinese](),建议使用[c.widget.calendar](c.widget.calendar.md)替代.

    var calendar = new Calendar({
        date: {
            start: {
                headtitle: '出发日期选择',
                title: function (date, sformat) {
                    var str = '<em style="font-size:10px;">出发日期</em><i>' + sformat(date)+'</i>';
                    return str;
                },
                value: dTime
            },
            back: {
                headtitle: '返程日期选择',
                title: function (date, sformat) {
                    var str = '<em style="font-size:10px;">返程日期</em><i>' + sformat(date)+'</i>';
                    return str;
                },
                value: eTime,
                bound: {
                    rules: { '>': 'start' },
                    error: function () {
                        self.showToast('请选择比出发日期更晚的时间', 1);
                    }
                }
            }
        },
        title: '出发日期选择',
        callback: function (date, datename, dates, d, end) {
            var start = dates['start'],
                back = dates['back'];
            //console.log(arguments);
            if (datename === 'start' && start >= back) {
                if (start < end) {
                    this.setDate({
                        back: (new cBase.Date(start)).addDay(1).valueOf(),
                        start: start
                    });
                } else {
                    this.setDate({
                        back: new Date(start),
                        start: start
                    });
                }
            }
            self.setPanelDate.apply(self, arguments);
            this.hide();
        },
        onShow: function () {
            self.$el.hide();
        },
        onHide: function () {
            self.$el.show();
        }
    });

    calendar.create();

## Properties 属性


### title
    日历标题
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

### create
create()

创建Calendar的Dom结构,但不会将日期显示出来

    calendar.create()

### show
show()

将Calendar显示出来,如此前Calendar未生成,则自动调用create()方法

    calender.show()

###  hide
hide()

将Calender隐藏

    clender.hide()

### addDate
addDate(Object)

为Calendar增加状态,参数格式参看构造函数.

    calendar.addDate({
        back: {
            headtitle: '返程日期选择',
            title: function (date, sformat) {
                var str = '<em style="font-size:10px;">返程日期</em><i>' + sformat(date)+'</i>';
                return str;
            },
            value: eTime,
            bound: {
                rules: { '>=': 'start' },
                error: function () {
                    self.showToast('请选择比出发日期更晚的时间', 1);
                }
            }
        }
    }, true);


### removeDate
removeDate([dateKey])

删除实例化Calendar时定义的状态,接受参数值为数组

    calendar.removeDate(['back']);

### setDate
setDate(Object)

设置Calender某中状态的值,如选中日期

    calendar.setDate({
        start: new Date()
    });

### getDate
getDate()

获得Calendar的状态信息,包括各状态的选中日期


### setCurDate
setCurDate(dateKey)

设置当前选中日期,dateKey为字符串类型,为实例化Calendar传的的Date的属性,如start,back等.如调用了此方法,则日历UI使用当前的dataKey的定义,如标题,当前选择日期.

    calendar.setCurDate('start')

### getEndDate
getEndDate()

获取日历的最后一天

    var endDate = calendar.getEndDate()



