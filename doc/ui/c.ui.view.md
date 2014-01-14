c.ui.view
===========
继承自Backbone.View.

view是H5 WebApp框架的核心组件之一,一个View代表了一个手机上看到的界面,一般有一个.html文件和一个.js文件组成.不同view由浏览器url的hash区分.
一个典型的view访问地址为#ticketlist,有两咱通过url向view传递参数的方式,分别用!和?分隔.

     #ticketlist/?name=value
     #ticketlist/!value/hoe

所有的业务View都继承此类.子类拥有Backbone.View的方法和此View的生命周期.,新框架推荐使用以[c.page.base.md]()或者[c.page.common.list]()

    var View = c.view.extend({
        pageid: '212003',

        events: {
            'click #js_return': 'backAction'
        },

        //首次记载view，创建view
        onCreate: function () {

        },
        //加载数据时
        onLoad: function (lastViewName) {
            //updatePage为自定义的请求数据的方法,参数为成功时的回调
            this.updatePage(function () {
                this.turning();
            })
        },
        //调用turning方法后触发
        onShow: function () {
            this.setTitle('机票搜索页');
        },
        //
        onHide: function () {
            this.resizehandler && $(window).unbind('resize', this.resizehandler);
        }
    });
## Properties

### pageid [option]

UBT统计的使用的pageid

### events

Backbone的events对象,用以注册事件

   events: {
       'click #js_return': 'backAction'
   },

### request
包含一些请求的无数据

    {
        fullhash: "booking",
        path: ['value','hoe'],      // 以!value/hoe格式传递的参数
        query:{
            name:'value'            //以name=value格式传递的参数
        },
        root:"/webapp/car/d.html",
        viewpath:""booking""
    }
### referrer
由那一个view进入当前view,如从/webapp/car/#list进入/webapp/car/#detail,则detail视图的referrer为list.

## Method

### onCreate

View第一次载入时调用,在声明周期只调用一次.一般在此方法中保存dom元素的引用.

### onLoad

每次调转至此View时候调用,一般在此方法中请求数据,渲染html.在此方法中需要显式调用view.turning()方法,以显示当前view.

    onLoad():{
        var self = this;
         //updatePage为自定义的请求数据的方法,参数为成功时的回调
        this.updatePage(function () {
            self.turning();
        });
    }

### onShow

view显示后调用的方法.

### onHide

view隐藏后调用的方法.

### turning

触发转场动画,必须在onLoad中显式调用,否则无法调用以后onShow,onHide方法

### showLoading

显示Loading图标

### hideLoading

隐藏Loading图标

### forward

forward(ur,noInHistroy[option])

前进至url指定view,如果noInHistroy为true,则浏览器的前进/后退按钮无法找到该url的历史记录

    this.forward('booking');

### back

back(url[option])

回退,如指定url,回退至url指定view,否则至window.history中的前一view.

### jump

jump(url)

跳转至非单页应用或者另一单页应用页面

     this.jump('html5');
     this.jump('/webapp/fltintl/#flightlist');

### getQuery

getQurey(paramName) ==> String

获取以?间隔传参数时url中参数的值

    #ticketlist/?name=value
    var v = this.getQuery('name');
    console.log(v);//value;

### getPath

getPath(index)

获得url中路径中的某一部分

    * #ticketlist/!value/hoe
      var v = this.getPath(0);
      console.log(v);//value;

### showToast

showToast(title, timeout[option], callback[option], clickToHide[option]);

在界面显示一条toast提示信息,默认timeout为3000ms,clickToHide为true,允许点击取消

    this.showToast()

### getServerDate

getServerDate(callback)

获得服务器时间

### restoreScrollPos
restoreScrollPos()
将当前view的滚动条位置还原至上一次离开的位置

    this.restoreScrollPos();

### showMessage

showMessage(message,title)

弹出提示框

### showWaming

showWaming(title,callback)

显示Waming
