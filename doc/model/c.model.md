# c.model

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.model.png)

### 简单描述
抽象model

### Attribute

    // @param useHead {Boolean}             是否使用head信息
    // @param head {Object}                 头部参数信息
    // @param result {Object}               数据缓存

### Method

**public setHead**

    // 设置头
    setHead: function (head) { ... }

**public getHead**

    // 获取头
    getHead: function () { ... }

**public buildurl**

    // 重写父类url
    buildurl: function () { ... }

**public getTag**

    // 获取tag信息，看用户是否变化，以便重写请求数据
    getTag: function () { ... }

**public excute**

    // 获取数据
    execute: function (onComplete, onError, ajaxOnly, scope, onAbort, tag ) { ... }

**public getParamStore**

    // 设置请求参数store对象
    getParamStore: function () { ... }

**public setParamStore**

    // 设置请求参数store对象
    setParamStore: function (obj) { ... }

**public getResultStore**

    // 获得结果集
    getResultStore: function () { ... }

**public setResultStore**

    // 设置结果集
    setResultStore: function (result) { ... }

**public clearResult**

    // 清除结果集
    clearResult: function () { ... }

**public setParam**

    // 重写父类设置请求参数
    setParam: function (key, val) { ... }

**public getParam**

    // 重写父类获取请求参数
    getParam: function () { ... }


### 使用方法

STEP 1: 在RequireJS中引入c.model

    define(['app/model/c.model'], function(Model){

    });

STEP 2: 继承

    define(['app/model/c.model'], function(Model){
        var AbstractModel = new cBase.Class(baseModel, {});
    });

该类主要用与继承，并不单独使用，该类为H5网站业务关联的model