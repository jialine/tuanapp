# c.ui.layer

### UML图

![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.layer.png)

### 简单描述
该类一般不单独使用，而是提供其它类作物父类，尤其适合作为弹出层类的父类

### 使用方法

STEP 1: 在RequireJS中引入c.ui.input.mask

    define(['app/ui/c.ui.layer'], function(Layer){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.layer'], function(Layer){
        var Loading = new cBase.Class(Layer, {
            __propertys__: function () {
            },
            initialize: function ($super) {
            }
          });
    });

该方法主要继承至c.ui.abstract，其中的show方法与hide方法皆来源与此类