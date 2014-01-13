# c.abstract.app

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/app.png)


### 简单描述
app.js作为我们系统总的控制器（路由）而存在，c.abstract.app作为抽象的app而存在

### Attribute

    // @param webroot {String}              根节点
    // @param viewRootPath {String}         业务view的搜索路径
    // @param defaultView {String}          默认的view，不输入view时候显示的view
    // @param request {Object}              每次请求时的request对象
    // @param viewpath {String}             当前view路径
    // @param mainframe {Dom}               主框架
    // @param viewport {Dom}                视图框架
    // @param statedom {Dom}                状态框架
    // @param views {hash}                  视图hash集合
    // @param curView {view}                当前视图对象
    // @param lastView {view}               最后访问视图对象（可能为null）
    // @param inteface {Object}             开放给view的接口
    // @param isCreate {Boolean}            Dom结构是否创建
    // @param history {Array}               历史记录
    // @param stopListening {Boolean}       是否暂停监控
    // @param timeoutres {Boolean}          资源
    // @param lastHash {String}             上一次hash
    // @param lashFullHash {String}         上一次完整hash
    // @param isChangeHash {Boolean}        hash是否改变
    // @param animations {animation}        动画相关函数
    // @param isAnimat {Boolean}            单次是否使用动画
    // @param animatSwitch {Boolean}        总动画开关
    // @param animForwardName {String}      向前动画名
    // @param animBackwardName {String}     向后动画名
    // @param animNoName {String}           没有动画时候的动画名
    // @param path {Array}
    // @param path {Object}                 url query 参数
    // @param viewMapping {Object}          view url映射


### Method

**public setOption**

    // 设置参数
    // @param options {Object}        相关参数
    setOption: function (options) { ... }

**public buildEvent**

    // 创建事件
    buildEvent: function () { ... }

**public onHashChange**

    // hash变化时候触发的事件
    onHashChange: function () { ... }

**public _onHashChange**

    // hash变化时候触发的事件，被onHashChange调用
    _onHashChange: function () { ... }

**public parseHash**

    // 处理url hash
    // @param hash {Object}        hash
    parseHash: function (hash) { ... }

**public localObserver**

    // hashchange观察点函数，处理url以及动画相关
    // @param req {Object}          request对象
    // @param isForward {Boolean}   向前或者向后
    localObserver: function (req, isForward) { ... }

**public switchView**

    // 切换view
    // @param path {String}         view路径
    switchView: function (path) { ... }

**public startAnimation**

    // 切换view时候的执行动画
    // @param callback {function}         回调函数
    startAnimation: function (callback) { ... }

**public loadView**

    // 切换view时候的执行动画
    // @param path {String}         需要加载的view
    // @param callback {function}         回调函数
    loadView: function (path， callback) { ... }

**public buildUrl**

    // 根据mapping构建url
    // @param path {String}         需要加载的view
    buildUrl: function (path) { ... }

**public createViewPort**

    // 创建页面框架dom
    createViewPort: function () { ... }

**public lastUrl**

    // 返回最后一次view
    lastUrl: function () { ... }

**public startObserver**

    // 开启监控
    startObserver: function () { ... }

**public endObserver**

    // 关闭监控
    endObserver: function () { ... }

**public forward**

    // view跳转
    forward: function (url, replace, isNotAnimat) { ... }

**public back**

    // view跳转
    back: function (url, isNotAnimat) { ... }



### 使用方法

    在RequireJS中引入app/c.abstract.app

    define(['app/c.abstract.app'], function(AbstractAPP){
        var Appliction = new cBase.Class(AbstractAPP, {});
        return Appliction;
    });

该类主要用于继承，重写内部的业务逻辑，但是单独使用也可

    require(['libs', 'App'], function (libs, App) {

      var app = new App({
        'defaultView':  window.PATH.DEFAULTINDEX,
        'viewRootPath': window.PATH.VIEWS_PATH
      });

    });


