# c.ui.loading.layer

### UML图

![Toast UML](http://git.dev.sh.ctripcorp.com/cmli/ctrip-wireless-h5-lizard/raw/H5V2.2S6/doc/img/c.ui.page.view.png)

### 简单描述
提供一个具有关闭按钮的loading框

### Attribute

    // @param contentDom {dom}                underscore提供的模板方法
    // @param callback {function}                标题
    // @param message {String}              内容体


### 使用方法

STEP 1: 在RequireJS中引入c.ui.loading.layer

    define(['app/ui/c.ui.loading.layer'], function(LoadingLayer){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.loading.layer'], function(LoadingLayer){
      var msgBox = new c.ui.LoadingLayer(function () {
          scope.m.ajax.abort();
          this.hide();
          return;
      });
      msgBox.show();
    });

