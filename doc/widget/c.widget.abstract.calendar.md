# c.ui.alert

### 样例图
![Loading Image](../raw/H5V2.2S6/doc/img/example.alert.png)

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.ui.alert.png)

### 简单描述
该类用于提供类似于alert的弹出层

### Attribute

    // @param tpl {function}                underscore提供的模板方法
    // @param title {String}                标题
    // @param message {String}              内容体
    // @param buttons {array}               需要生成的按钮
    // @param viewdata {object}             模板视图文本

### Method

**public buildEvent**

    // 该方法用于为alert框各个事件点注册回调函数
    buildEvent: function () { ... }

**public buildViewData**

    // 为viewdata赋值
    buildViewData: function () { ... }

**public setViewData**

    // 为viewdata赋值（调用buildViewData）
    setViewData: function (data) { ... }

**public loadButtons**

    // 生成按钮以及按钮绑定的点击回调函数
    loadButtons: function () { ... }

**public createButtons**

    // 具体按钮生成函数（loadButtons调用他）
    createButtons: function () { ... }

**public createHtml**

    // 返回模板组装后的html
    createHtml: function () { ... }


### 使用方法

STEP 1: 在RequireJS中引入c.ui.alert

    define(['app/ui/c.ui.alert'], function(Alert){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.alert'], function(Alert){
      this.alert = new cUI.Alert({
          title: '提示信息',
          message: '',
          buttons: [{
              text: '知道了',
              click: function () {
                  this.hide();
              }
          }
          ]
      });

      this.alert.setViewData({
          message: message,
          title: title
      });
      this.alert.show();
      this.alert.hide();
    });

