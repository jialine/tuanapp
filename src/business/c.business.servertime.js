define(['cCoreConsole'], function (cCoreConsole) {
    var C = function() {};
    
    /**
    * @Desc :  此处 _isInApp 与 c.utility.isInApp 相冗余，因当前cbase 与 utility 存在循环引用问题，故此暂时保留
    * @ToDo :  用 cUtility.isInApp 代替
    */
    var _isInApp = function () {
        // 旧版本
        var oldData = window.localStorage.getItem('isInApp');
        if (oldData) {
            return oldData == '1' ? true : false;
        }

        // 新版本
        var data = window.localStorage.getItem('ISINAPP');
        if (data) {
            return data == '1' ? true : false;
        }
    };
    

    C.getServerDate = function (callback) {

        // 通过动态的添加script标签的方法，避免App不能访问从而导致page load fail的问题
        // var scriptDone = document.getElementById('SERVER_DATE');
        // if (scriptDone && __SERVERDATE__) {
        //   var servertime = new Date(__SERVERDATE__.server.valueOf() + (new Date().valueOf() - __SERVERDATE__.local.valueOf()));
        //   callback && callback(servertime);
        //   return servertime;
        // }else{
        //   var script = document.createElement("script");
        //   script.id = 'SERVER_DATE';
        //   script.src = 'http://m.ctrip.com/html5/ClientData/LoadServerDate'
        //   script.onload = script.onreadystatechange = _getServerDateCallback;
        //   document.documentElement.appendChild(script);

        //   callback && callback(new Date());
        //   return new Date();
        // }

        // var __SERVERDATE__ = {server:new Date,local : new Date};
        // if (location.pathname.match(/^\/?html5/i)) {
        //   callback && callback(new Date());
        //   return new Date();
        // } else {
        //   if (typeof __SERVERDATE__ === 'undefined' || !__SERVERDATE__.server) {
        //       C.console.log("无服务端时间参考，请在html入口文件添加指向'/html5/ClientData/LoadServerDate'的script标签");
        //       callback && callback(new Date());
        //       return new Date();
        //   }
        //   var servertime = new Date(__SERVERDATE__.server.valueOf() + (new Date().valueOf() - __SERVERDATE__.local.valueOf()));
        //   callback && callback(servertime);
        //   return servertime;
        // }

        if (_isInApp()) {
            var serverdate = window.localStorage.getItem('SERVERDATE');
            if (serverdate) {
                try {
                  serverdate = JSON.parse(serverdate);
                  if (serverdate && serverdate.server && serverdate.local) {
                    var servertime = window.parseInt(serverdate.server);
                    var localtime = window.parseInt(serverdate.local);
                    var currenttime = (new Date()).getTime();

                    var cServertime = new Date(servertime + currenttime - localtime);
                    callback && callback(cServertime);
                    return cServertime;
                  } else {
                    callback && callback(new Date());
                    return new Date();
                  }
                } catch (e) {
                  callback && callback(new Date());
                  return new Date();
                }

                // timestamp = C.Date.parse(timestamp)
                //timestamp = window.parseInt(timestamp);
                //var date = new Date(timestamp);
                //callback && callback(date);
                //return date;
            } else {
                callback && callback(new Date());
                return new Date();
            }
        } else {
            if (location.pathname.match(/^\/?html5/i)) {
                callback && callback(new Date());
                return new Date();
            } else {
                if (typeof __SERVERDATE__ === 'undefined' || !__SERVERDATE__.server) {
                    cCoreConsole.console.log("无服务端时间参考，请在html入口文件添加指向'/html5/ClientData/LoadServerDate'的script标签");
                    callback && callback(new Date());
                    return new Date();
                }
                var servertime = new Date(__SERVERDATE__.server.valueOf() + (new Date().valueOf() - __SERVERDATE__.local.valueOf()));
                callback && callback(servertime);
                return servertime;
            }
        }


    };    

    return C;
});