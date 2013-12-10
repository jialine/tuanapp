# c.ui.ScrollList

ScrollList是一个弹出的滚动列表的插件，他支持两种形式的弹出
第一种为列表型，该种形式用户可以上下拖动，最后需要鼠标点击选择才能选择项目
第二种为单选型，该种形式用户不需要单击，每一次选择的就是最中间一项

        var data = [];
        for (var i = 0; i < 100; i++) {
            var temp = { val: '选项-' + i };
            data.push(temp);
        }

        var myScroll = new ScrollRadio({
            type: 'list',//radio
            wrapper: $('#ctripPage'),
            data: data
        });

## Properties
### wrapper
指明控件容器，我们的控件会放到这个dom里面
### type
指明控件类型，list/radio
### className
指明控件body的class
### scrollClass
指明滚轮的className
### animateParam
证明动画参数，可以根据他调整拖动的动画与移动速度与距离
### disItemNum
指定需要显示的项目数（因为手机屏幕有所限制，不建议超过5项，超过5项，现在会让其无意义）

        this.disItemNum = this.disItemNum > 5 ? 5 : this.disItemNum;
### index
设置初始化时候的选项，与html select类似

### data
设置数据源，数据源格式为一维数组，数组项为json对象

### changed
设定选择项改变时候触发的事件，会传入当前选择项的参数

        secItem = this.data[this.selectedIndex];
        changed.call(scope, secItem);

## Method

### reload
重新加载数据时，会使用的方法，需要传入一个新的数据源

### setkey
传入键值，便会选择指定项

### setIndex
设置滚轮索引值

### getSelected
获取当前选项，返回一个json对象

### removeEvent
用于销毁时清理事件句柄

