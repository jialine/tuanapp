# c.ui.abstract.view

### UML图

![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.abstract.view.png)

### 简单描述
该类为所以view的抽象类，除了业务view外，所以的view90%继承至他，所以该类非常重要，提供了很多基础的方法
其中核心点是调用show时候会执行create方法从而触发oncreate事件，并且触发onshow事件
而各个事件点的注册函数却是我们自己可以处理的：

    this.addEvent('onShow', function () {});//在show时候触发的函数


### Attribute

    // @param allowEvents {array}             允许设置的事件，只能设置onCreate/onShow/onHide
    // @param allowsPush {object}             允许设置的属性
    // @param allowsConfig {object}           允许设置的基本配置
    // @param events {object}                 用于存储各个事件需要执行的事件句柄（简单情况每种事件只会注册一个回调）
    // @param setOptionHander {array}         设置值时要执行的回调
    // @param rootBox {dom}                   根节点容器
    // @param id {String}                     根节点唯一id
    // @param root {dom}                      根节点
    // @param isCreate {dom}                  是否创建根节点

### Method

**public readOption**

    // 读取构造函数（实例化）传入的参数，并遍历参数对象，并将键值对作为参数传递给setOptionHander集合中的函数执行
    // @param opts {object}        构造函数（实例化）传入的参数
    readOption: function (opts) { ... }

**public setOption**

    // 传入回调函数给setOptionHander数组集合
    // @param fun {function}        回调函数
    setOption: function (fun) { ... }

**public createRoot**

    // 构建根节点
    createRoot: function () { ... }

**public addClass**

    // 为根节点添加class样式，传入参数可能是数组可能是字符串
    // @param cls {String/array}        classname
    addClass: function (cls) { ... }

**public removeClass**

    // 删除根节点class样式，传入参数可能是数组可能是字符串
    // @param cls {String/array}        classname
    removeClass: function (cls) { ... }

**public removeClass**

    // 删除根节点class样式，传入参数可能是数组可能是字符串
    // @param cls {String/array}        classname
    removeClass: function (cls) { ... }

**public createHtml**

    // 子类必须重写的方法，不重写会抛出一个错误
    createHtml: function () { ... }

**public setRootHtml**

    // 设置根节点html内容
    // @param html {String/dom}
    setRootHtml: function (html) { ... }

**public getRoot**

    // 获取根节点
    getRoot: function () { ... }

**public addEventType**

    // 增加新的可添加事件点
    // @param type {String}    事件点名称
    addEventType: function (type) { ... }

**public addEvent**

    // 为各个事件点添加需要回调的函数
    // @param type {String}     事件名称
    // @param fun {function}    回调函数
    addEvent: function (type, fun) { ... }

**public removeEvent**

    // 移除事件点的回调函数
    // @param type {String}     事件名称
    // @param fun {function}    回调函数
    removeEvent: function (type, fun) { ... }

**public remove**

    // 移除节点
    remove: function (type, fun) { ... }

**public trigger**

    // 触发事件点保存的事件
    // @param type {String}     事件名称
    // @param args {object}     传入的参数
    trigger: function (type, args) { ... }

**public create**

    // 初始化函数
    create: function () { ... }

**public template**

    // 返回解析过的模板函数（underscore方法，执行时传入参数对象即可）
    // @param html {String}     模板html
    template: function (html) { ... }

**public showAction**

    // 显示时执行的方法
    // @param callback {function}     回调函数
    showAction: function (callback) { ... }

**public hideAction**

    // 隐藏时执行的方法
    // @param callback {function}     回调函数
    hideAction: function (callback) { ... }

**public setzIndexTop**

    // 设置z-index的值为最大
    // @param offset {int}
    setzIndexTop: function (offset) { ... }

**public isNotCreate**

    // 判断是否未创建根节点
    isNotCreate: function () { ... }

**public isShow**

    // 判断是否显示
    isShow: function () { ... }

**public isHide**

    // 判断是否隐藏
    isHide: function () { ... }

**public show**

    // 显示时的函数
    // @param callback {function}
    show: function (callback) { ... }

**public hide**

    // 隐藏时的函数
    // @param callback {function}
    show: function (callback) { ... }

**public reposition**

    // 重置root位置让其居中显示（多用于弹出层类）
    reposition: function () { ... }


### 使用方法

STEP 1: 在RequireJS中引入c.ui.input.mask

    define(['app/ui/c.ui.abstract.view'], function(AbstractView){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.abstract.view'], function(AbstractView){
        var Loading = new cBase.Class(AbstractView, {
            __propertys__: function () {
            },
            initialize: function ($super) {
            }
          });
    });

该类用作其他view继承，本身不应该做实例化操作