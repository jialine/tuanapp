# c.ui.warning404

### 样例图
![Loading Image](../raw/H5V2.2S6/doc/img/example.warning404.png)

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.ui.warning404.png)

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

    define(['app/ui/c.ui.warning404'], function(Warning404){});

STEP 2: 初始化

    define(['app/ui/c.ui.warning404'], function(Warning404){
      // --------------------
      // 初始化warning404控件
      var warning404 = new cUI.Warning404();

      // --------------------
      // 设置"重试"按钮回调
      warning404.retryClick(callback);

      // --------------------
      // 显示warning404
      warning404.show();

      // --------------------
      // 关闭warning404
      warning404.hide();
    });