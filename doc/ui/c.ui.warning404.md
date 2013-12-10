# c.ui.warning404

### UML图
![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.warning404.png)

### Attribute

    // @param retryDom {dom}           重试按钮dom
    // @param callback {function}      点击按钮时候的回调函数

### Method

**public retryClick**

    // @param callback {function}        重写callback的值
    retryClick: function (callback) { ... }

这里主要复写了父类的show和hide方法


### 使用方法

STEP 1: 在RequireJS中引入c.ui.warning404

    define(['app/ui/c.ui.warning404'], function(Warning404){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.warning404'], function(Warning404){
      var warning404 = new cUI.Warning404();
      warning404.retryClick(callback);
      warning404.show();//打开
      warning404.hide();//关闭
    });
