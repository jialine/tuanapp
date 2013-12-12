# c.ui.mask

### UML图

![Toast UML](../raw/H5V2.2S6/doc/img/c.ui.mask.png)

### 简单描述
该类用于提供一个蒙版，蒙版的样式根据css而有所不同

### 使用方法

STEP 1: 在RequireJS中引入c.ui.input.mask

    define(['app/ui/c.ui.mask'], function(Mask){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.mask'], function(Mask){
      var mask = new Mask();
      mask.show();
      mask.hide();
    });

该方法主要继承至c.ui.abstract，其中的show方法与hide方法皆来源与此类