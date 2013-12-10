c.ui.core
================
提供了一系统ui类及工具方法

AbstractView
=============
抽象view类，提供最基础的事件机制和显示隐藏.所有的cui中的大部分的view继承了这个类，继承此类时要实现createHtml方法，这个方法必须返回一个{String|Element|jQuery}对象

onCreate
--------
组件创建完成后触发

onShow
--------
组件显示后触发

onHide
----
组件隐藏后触发

createRoot
----------
创建根元素

addClass
----------
addClass(className)

给当前组件添加一个className

removeClass
-------------
removeClass(className)

给当前组件删除一个className

createHtml
-------------
抽象方法,所有的view都需要实现此方法，子类实现此方法需返回一个{String|Element|jQuery}

setRootHtml
--------
设置当前组件的内容

getRoot
-------
获得当前组件的Root节点


addEvent
-------
addEvent(eventType,fun)

添加一个事件

removeEvent
---------
removeEvent(eventType,[fun])

删除绑定事件,如果fun不传，则删除掉eventType指定的所有事件

show
-----------
show([callback])

显示组件

hide
-------
hide([callback])

隐藏控件

remove
------
remove()

删除当前组件

trigger
-----
trigger(eventType,agrs)

触发事件


AbstractView.STATE_NOTCREATE = 'notCreate';
------------
 组件状态,未创建

AbstractView.STATE_ONCREATE = 'onCreate';
---------------
组件状态,已创建但未显示

AbstractView.STATE_ONSHOW = 'onShow';
---------
组件状态,已显示

AbstractView.STATE_ONHIDE = 'onHide';
---------
组件状态,已隐藏

Mask
======
遮罩层

       var opacityMask =  new Mask({
            classNames: [ 'opacitymask']
        });
        opacityMask.show()

Layer
======
一个显示层，用于放置各种控件

    var layer =  new Layer({
        classNames: [ 'opacitymask']
    });
    layer.show()

Alert
=======
Alert({title,message,[buttons]})

弹出框

    var alert = new Alert({
        title :'title',
        message: 'message content','
        buttons:[
            {
                text:'取消'
                type:'cancel',
                click:function(){
                }
            },{
                text: '确定',
                click:function(){
                }
            }
        ]
    };
    alert.show();

Select
====
Select框

    var idCardList = new c.ui.Select({
        'select': this.$el.find('#sel_idCard'),
        'title': '选择证件',
        'autocreate': true,
        'onChange': function (val, oldval, option) {
            val[0].no = $(option).data('no');
            val[0].index = $(option).index();
            _this.onChangeIdCard(val[0]);
        },
        'onShow': function () {
            _this.elsBox.p_add_wrap.hide();
        },
        'onHide': function () {
            _this.elsBox.p_add_wrap.show();
        },
        'protitlehandler': function (text, option) {
            return '<div><span>' + text + '</span><span>' + $(option).data('no') + '</span></div>';
        }
    });
    idCardList.show();

select
----------
选择的元素

title
-----------
标题

autocreate
----------
是否自动生成

onChange
---------
选择项变化时触发

onShow
---------
组件显示时触发

onHide
--------
组件隐藏时触发

protitlehandler[option]
-----------
标题预处理

Loading
=======
错误提示层,继承自[AbstractView]()

    var loading = new Loading();
    loading.show();
    loading.hide();

CloseLoading
=======
可关闭的Loading框,,继承自[AbstractView]()

    var msgBox = new CloseLoading();
    msgBox.setHtml('正在发送...');
    msgBox.callback = function () {
        scope.m.ajax.abort();
        this.hide();
        return;
    };
    msgBox.show();

ScrollRadioList
=======
 滚动列表

HeadWarning
=========
带Head的警告框

    var warning = new HeadWarning()
    warning.setTitle('Title','找不到数据,请修改条件重试!')；
    warning.show()

setTitle
---------
setTitle(title,content,[callback])

设置HeadWarning的title和callback


NoHeadWarning
============
带Head的警告框

    var warning = new NoHeadWarning()
    warning.setContent('网络错误')；
    warning.show()

setContent
---------
 setContent(content)

 设置显示内容

Toast
======
Toast弹层提示

show
-----------
 show(title, [sleep], [callback], [clickToHide])

显示Toast,title为显示内容,sleep显示时间,callback隐藏时回调,clickToHide是否允许点击时隐藏

    var toast = new Toast()
    toast.show('网络错误')；

hide
------
hide()

隐藏toast

      toast.hide()；

InputClear
======
InputClear(input, clearClass, clearCallback, offset)

输入框清除按键

      c.ui.InputClear(inputName);

Tools
=========
一系列工具方法

getElementPos
getElementPos(el) ==> Object{top:10,left:20}

获得元素的在页面中的绝对位置

getCreateId
----------
获得唯一的id

getBiggerzIndex
--------------
getBiggerzIndex() ==> Number

获得更大的zIndex值，每次调用该函数，都会产生一个更大值的z-index

getPageSize
----------

获得屏幕的显示高宽

getPageScrollPos
---------
获得窗口滚动条的位置

     {
         left: 页面滚动条所在x轴位置
         top: 页面滚动条y轴位置
         height: 窗口高度
         width: 窗口宽度
         pageWidth: 页面实际宽度
         pageHeight: 页面实际高度
       }
获得窗口滚动条的位置

getCurStyleOfEl
----------
getCurStyleOfEl(el.StyleName)==>String

获得某个元素的最终的样式值


getElementRealSize
--------------
获得元素占位的高宽

getMousePosOfElement
-----------
获得event在元素上的位置

getMousePos
----------
getMousePos() ==>{top:10,left:20}

获得鼠标位置



createElement
----------
便捷创建元素方法

HashObserve
============
页面中单个ui组件弹出时,添加hash值，监控下回hashchange事件触发时，添加的hash是否还存在，不存在则调用callback

EventListener
================
事件支持类