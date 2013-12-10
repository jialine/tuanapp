# c.ui.head.warning

### UML图
![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.head.warning.png)

### Attribute

    // @param warningtitleDom {dom}           标题dom
    // @param warningcontentDom {dom}         内容区dom
    // @param warningtitle {String}           标题文本
    // @param warningcontent {String}         内容文本
    // @param callback {function}             点击后退的回调函数

### Method

**public setTitle**

    // @param title {String}           标题文本
    // @param content {String}         内容文本
    // @param callback {function}      点击后退的回调函数
    setTitle: function (title, content, callback) { ... }

此处重写了父类的show与hide


### 使用方法

STEP 1: 在RequireJS中引入c.ui.warning404

    define(['app/ui/c.ui.head.warning'], function(HeadWarning){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.head.warning'], function(HeadWarning){
      var headwarning = new HeadWarning({
                      title, content, callback
                  });
      headwarning.show();
    });

