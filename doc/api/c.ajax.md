# c.ajax

该类提供了ajax请求数据的一些方法

## Method

### get

  c.ajax.get(url,data,success,error)

以get方式向url提交数据,data可以为json格式js对象,也可以为查询字符串,成功返回数据执行success回调,失败执行error回调.此方法不能跨域.

    var obj ={id:'1',opr:'2'};
    c.ajax.get('http://waptest.ctrip.com/restapi/test',obj,function(data){
            //do something
        },function (err){
            //error handler
    ));

### post
c.ajax.post(url,data,success,error)


以post方式向url提交数据,data可以为json格式,成功返回数据执行success回调,失败执行error回调.此方法不能跨域.

    var obj ={id:'1',opr:'2'};
    c.ajax.get('http://waptest.ctrip.com/restapi/test',obj,function(data){
            //do something
        },function (err){
            //error handler
    ));

### jsonp

c.ajax.jsonp(url,data,success,error)


以jsonp方式向url跨域请求数据,data为json格式,成功返回数据执行success回调,失败执行error回调

    var obj ={id:'1',opr:'2'};
    c.ajax.get('http://waptest.ctrip.com/restapi/test',obj,function(data){
            //do something
        },function (err){
            //error handler
    ));


### cross

c.ajax.cross(url,type,data,success,error)


以cross方式向url跨域请求数据,type指定http请求类型,post/get者选一.data为json格式,成功返回数据执行success回调,失败执行error回调

    var obj ={id:'1',opr:'2'};
    c.ajax.get('http://waptest.ctrip.com/restapi/test','post',obj,function(data){
            //do something
        },function (err){
            //error handler
    ));
