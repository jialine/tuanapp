# c.model

该类是系统model的抽象类，所有view中的model皆继承自此model；
该类用于在服务器端存取数据，并且操作本地localstorage，在系统中担任服务器到客户端的桥梁。

用户无法直接使用Model类,必须使用继承Model的子类,通过子类的实例进行数据操作.

    cityModel = new cBase.Class(Model, {
        __propertys__: function () {
            this.url = '/Flight/Domestic/Delivery/Query';
            this.param = FlightStore.FlightPickTicketParamStore.getInstance();
            this.result = FlightStore.FlightPickTicketStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

## Propertys

子类必须实现的方法,定义Model的属性.

### url
必填，数据读取url

### param

必选，用于存贮请求参数,可以为一个store或者对象

    this.param = {key :'1'}
    this.param = FlightStore.FlightPickTicketParamStore.getInstance();;

### result [option]

可选，可以指定一个Store,用于存贮结果

### dataformat [option]

可选,定义一个格式化函数,用以格式后ajax返回数据,如定义此函数,会将格式化后的数据存至store

### debug [option]
可选,是否为debug模式,默认为false

### protocol [option]
通讯协议,默认为http

### usehead [option]

提交参数是否加入head,默认为true

### ajaxOnly [option]

只通过ajax获取数据,默认为false

### contentType [option]
数据提交格式,默认JSON,可选值有

    AbstractModel.CONTENT_TYPE_JSON = 'json';
    AbstractModel.CONTENT_TYPE_FORM = 'form';
    AbstractModel.CONTENT_TYPE_JSONP = 'jsonp';

### method
数据提交方式,可选值为get/post/delete,默认为post

### OptionHanders
 参数设置函数

## Method

### setParam
setParm(Object)
setParam(key, val)

用于设置提交ajax时用到的参数,

    cityModel.setParam({key:2});
    cityModel.setParam('key',2);

### getParamStore

用于获取参数存储器

### setParamStore

设置参数存储器

### getResultStore

获得结果存储器

### setResultStore(result)

设置结果存储器，result为Store对象

### clearResult

清空Store对象中的结果数据

### getParam

获得参数

### buildurl

返回ajax调用地址

### getTag

获取resultStore中的tag值

### excute
 excute(onComplete, onError, ajaxOnly, scope, onAbort)

执行此方法时,会先检测result Store中的数据有无过期,如无过期,则取localStorage的数据,否则通过ajax请求数据,并将数据填充至Store.
ajaxOnly参数如为true,则强制ajax取数据

    flightDetailModel.excute(function (data) {
        this.hideLoading();
    }, function (err) {
        var self = this;
        var msg = err.msg ? err.msg : '啊哦,数据加载出错了!';
        this.showHeadWarning('机票预订', msg, function () {
            this.hide();
            self.backAction();
        })
        this.hideLoading();
    }, false, this);

### getInstance
getInstance()
获得对象的实例,使用了单例模式

    var flightDetailModel = FlightDetailModel.getInstance();























