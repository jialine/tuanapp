# c.ui.scroll.radio

### UML图
![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/dadf42aabf09b3ae81c91d6bbafadb0d60c726f0/doc/img/c.ui.scroll.radio.png)

### Attribute

    // @param title {dom}              标题dom
    // @param content {dom}            内容区dom
    // @param changed {array}          各个scroll的回调函数，数组装的是回调函数，当scroll组件发生变化时触发
    // @param mask {Mask}              蒙版遮盖层
    // @param scroll {array}           滚轮集合（数组）
    // @param data {array}             各个scroll组件数据源
    // @param index {array}            各个scroll组件索引
    // @param key {array}              各个scroll组件当前键值（优先级比index高）
    // @param disItemNum {int}         scroll组件显示项目
    // @param tips {dom}               提示区dom
    // @param btCancel {dom}           取消按钮dom
    // @param btOk {dom}               确定按钮dom
    // @param cancel {String}          取消文本
    // @param ok{String}               确定文本
    // @param cancelClick {function}   取消回调函数
    // @param okClick {function}       确定回调函数

### Method

**public setTips**

    // @param str {String}        tip区域要显示的内容
    setTips: function (str) { ... }

这里主要复写了父类的show和hide方法


### 使用方法

STEP 1: 在RequireJS中引入c.ui.scroll.radio

    define(['app/ui/c.ui.scroll.radio'], function(ScrollRadio){

    });

STEP 2: 初始化ScrollRadio

    define(['app/ui/c.ui.scroll.radio'], function(ScrollRadio){
      var scroll = new ScrollRadio({......});
    });

    于是便可初始化组件，点击蒙版，或者选择项目组件会自动关闭