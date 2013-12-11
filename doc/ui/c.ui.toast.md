# c.ui.toast

### 样例图
![Loading Image](../raw/H5V2.2S6/doc/img/example.toast.png)

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.ui.toast.png)

### Method

**public show**

    // @param title {String}        Toast需要显示的内容
    // @param sleep {int}           Toast显示的时间
    // @param callback {function}   Toast消失之后的回调
    // @param clickToHide {boolean} 点击Toast是否消失
    show: function (title, sleep, callback, clickToHide) { ... }

**public setContent**

    // @param content {String}      Toast需要显示的内容
    setContent: function (content){}

### 使用方法

STEP 1: 在RequireJS中引入c.ui.toast

    define(['app/ui/c.ui.toast'], function(Toast){ });

STEP 2: 初始化Toast

    define(['app/ui/c.ui.toast'], function(Toast){
      var toast = new Toast();
    });

STEP 3: 显示Toast

    define(['app/ui/c.ui.toast'], function(Toast){

      // --------------------
      // 初始化Toast控件
      var toast = new Toast();

      // --------------------
      // 显示Toast
      var toastContent = '抱歉，当前的网络状况不给力，请刷新重试!';
      toast.show(
        toastContent,         //Toast会显示的信息
        2,                    //Toast会停留的时间
        function () { ...},   //Toast消失之后的回调
        true                  //点击Toast是否会消失，默认为true
      );
    });

    以上设置效果：2s之后Toast会自动关闭，或者点击Toast会关闭