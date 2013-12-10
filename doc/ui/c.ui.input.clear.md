# c.ui.input.clear

### UML图

该类过于简单，于是未提供UML图

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

