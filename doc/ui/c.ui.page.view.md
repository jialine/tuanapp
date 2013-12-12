# c.ui.page.view

### UML图

![Toast UML](../raw/H5V2.2S6/doc/img/c.ui.page.view.png)

### 简单描述
该类用于提供一个显示层，放置各种控件，本身不推荐单独使用（多用作于继承）

### 使用方法

STEP 1: 在RequireJS中引入c.ui.page.view

    define(['app/ui/c.ui.page.view'], function(PageView){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.page.view'], function(PageView){
      var ScrollRadioList = new cBase.Class(PageView, {}）；
    });

该方法继承至c.ui.abstract，本身也是用于子类继承使用