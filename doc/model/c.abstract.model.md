# c.abstract.model

### UML图
![Toast UML](../raw/H5V2.2S6/doc/img/c.abstract.model.png)

### 简单描述
抽象model

### Attribute

    // @param url {String}                  请求地址
    // @param param {Object}                参数对象
    // @param dataformat {function}         正确返回请求数据格式化
    // @param validates {Array}             数据验证函数集合，其中有一个验证失败则失败
    // @param debug {Boolean}               是否开启debug状态
    // @param protocol {String}             请求协议
    // @param contentType {String}          请求方式，json/jsonp/......
    // @param method {String}               请求方式 post/get
    // @param ajax {Ajax}                   请求数据时候用到的ajax对象
    // @param isAbort {boolean}             是否放弃ajax
    // @param onBeforeCompleteCallback {function}         ajax返回正确数据，执行success方法前调用的方法


### Method

**public assert**

    // 验证必须设置的字段是否设置
    assert: function () { ... }

**public pushValidates**

    // 传入数据正确性验证函数集合
    pushValidates: function (handler) { ... }

**public setParam**

    // 设置请求参数
    setParam: function (key, val) { ... }

**public getParam**

    // 获取请求参数
    getParam: function () { ... }

**public buildurl**

    // 构建请求url，可被子类重写用于debug
    buildurl: function () { ... }

**public execute**

    // 获取数据
    execute: function (onComplete, onError, ajaxOnly, scope, onAbort, tag ) { ... }

**public abort**

    // 放弃ajax
    abort: function () { ... }




### 使用方法

STEP 1: 在RequireJS中引入c.abstract.model

    define(['app/model/c.abstract.model'], function(Model){

    });

STEP 2: 继承

    define(['app/model/c.abstract.model'], function(Model){
        var AbstractModel = new cBase.Class(baseModel, {});
    });

该类主要用与继承，并不单独使用