# c.ui.toast

### UML图
![Toast UML](http://git.dev.sh.ctripcorp.com/shbzhang/ctrip-h5-front-library-refactory/raw/H5V2.2S6/doc/img/c.ui.toast.png)

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

    define(['app/ui/c.ui.toast'], function(Toast){

    });

STEP 2: 初始化Toast

    define(['app/ui/c.ui.toast'], function(Toast){
      var toast = new Toast();
    });

STEP 3: 显示Toast

    define(['app/ui/c.ui.toast'], function(Toast){
      var toast = new Toast();
      toast.show('抱歉，当前的网络状况不给力，请刷新重试!', 2, function () {
        ...
      });
    });

    2s之后Toast会自动关闭，或者点击Toast会关闭