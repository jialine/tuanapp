# c.ui.loading

### 样例图

![Loading Image](../raw/H5V2.2S6/doc/img/example.loading.png)

### UML图

![Toast UML](../raw/doc/img/c.ui.loading.png)

### 使用方法

STEP 1: 在RequireJS中引入c.ui.input.clear

    define(['app/ui/c.ui.loading'], function(Loading){

    });

STEP 2: 初始化

    define(['app/ui/c.ui.loading'], function(Loading){
      var loading = new Loading();
      loading.show();
      loading.hide();
    });

该方法主要继承至c.ui.layer，其中的方法皆由他提供