# c.ui.scroll.radio.list

### UML图
![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/6cb164ee702ec5f7ad28006c433e415c14f67a9b/doc/img/c.ui.scroll.radio.list.png)

### Attribute

    // @param title {dom}              标题dom
    // @param content {int}            内容区dom
    // @param itemClick {function}     回调函数
    // @param mask {Mask}              蒙版遮盖层
    // @param scroll {ScrollList}      滚轮组件
    // @param data {array}             数据源
    // @param index {int}              scroll组件选择索引
    // @param key {String}             scroll当前键值（优先级比index高）
    // @param disItemNum {int}         scroll组件显示项目

### Method

这里主要复写了父类的show和hide方法


### 使用方法

STEP 1: 在RequireJS中引入c.ui.scroll.radio.list

    define(['app/ui/c.ui.scroll.radio.list'], function(ScrollRadioList){

    });

STEP 2: 初始化ScrollRadioList

    define(['app/ui/c.ui.scroll.radio.list'], function(ScrollRadioList){
      var scroll = new ScrollRadioList({......});
    });

    于是便可初始化组件，点击蒙版，或者选择项目组件会自动关闭