# c.ui.input.clear

### UML图

![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.input.clear.png)

### Parammeters

    // @param input {dom}                 需要添加功能的文本框
    // @param clearClass {String}         自定义class
    // @param clearCallback {function}    清空后的回调函数
    // @param offset {object}             设置点击按钮的位置

以上参数在实例化时候传入即可

### 使用方法

STEP 1: 在RequireJS中引入c.ui.input.clear

    define(['app/ui/c.ui.input.clear'], function(InputClear){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.input.clear'], function(InputClear){
      InputClear(el);
    });

