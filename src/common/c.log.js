define(['libs'], function () {

  window.onerror = function (errorMsg, errorFileUrl, lineNum) {
    cLog.errorLog(errorMsg, errorFileUrl, lineNum)
  };

  window.onload = function(){
    cLog.urlLog(window.location.href);
  };

  window.onhashchange = function(){
    cLog.urlLog(window.location.href);
  };

  var cLog = {

    serverLog : (function(){
        var _logFlag = false;
        var cfgStore = localStorage.getItem('H5_CFG');
        if(cfgStore){
          _logFlag = JSON.parse(cfgStore).value.serverLog;
        }
      return !!_logFlag;
    })(),
    /**
     * 保存error信息
     * @param errorMsg
     * @param errorFileUrl
     * @param lineNum
     * @returns {boolean}
     */
    errorLog: function (errorMsg, errorFileUrl, lineNum) {
      var error = this.buildErrorObj(errorMsg, errorFileUrl, lineNum);
      this.pushLog('ERROR_LOG',error);
      return false;
    },

    /**
     * 保存url history
     * @param url
     */
    urlLog:function(url){
      if(url.indexOf('monitor')>-1){
        return;
      }
      var data = {
        url :url,
        dt: this.getDateTime()
      };
      this.pushLog('URL_LOG',data);
    },


    restlog:function(url,request,response){
      if(! this.serverLog){
        return;
      }
      var data = {
        url : url,
        rspCode: response?'200':'404',
        req: request,
        rsp: response,
        dt: this.getDateTime()
      }
      this.pushLog('SERVER_LOG',data);
    },

    applog:function(name,param){
      var logStore = localStorage.getItem('APP_LOG') ;
      var appLog = logStore ? JSON.parse(logStore) : {};
      appLog[name] ={
        data : param,
        dt: this.getDateTime()
      }

      if (JSON.stringify) {
        logStr = JSON.stringify(appLog);
      } else {
        logStr = eval('(' + appLog + ')');
      }

      localStorage.setItem('APP_LOG', logStr);
    },

    buildErrorObj: function (errorMsg, errorFileUrl, lineNum) {
      var fileName = typeof errorFileUrl =='string' ? errorFileUrl.substr(errorFileUrl.lastIndexOf('/') + 1):'';
      //保存Error 错误调用堆栈
      return {
        msg:      errorMsg,
        file:     fileName,
        line:     lineNum,
        fullPath: errorFileUrl,
        dt:       this.getDateTime(),
        url:      window.location.href,
        restful:  {
          url:      '',
          request:  '',
          response: ''
        }
      };
    },

    /**
     * 保存Log对象
     * @param errorObj
     */
    pushLog: function (logName,logItem) {
      var logStore = localStorage.getItem(logName),
        logStr = [];
      var logStack = logStore ? JSON.parse(logStore) : [];
      //如果大于50条,删除最早的记录
      if (logStack.length > 0) {
        logStack.splice(50)
      }
      //新的记录放在数组的头部
      logStack.unshift(logItem);
      //序列化
      if (JSON.stringify) {
        logStr = JSON.stringify(logStack);
      } else {
        logStr = eval('(' + logStack + ')');
      }

      localStorage.setItem(logName, logStr);
    },

    /**
     * 格式化当前gr时间
     * @returns {number}
     */
    getDateTime: function () {
      var d = new Date();
      var dateTime = "";
      dateTime += d.getMonth() + 1;
      dateTime += '/';
      dateTime += d.getDate();
      dateTime += ' ';
      dateTime += d.getHours();
      dateTime += ':';
      dateTime += d.getMinutes();
      dateTime += ':';
      dateTime += d.getSeconds();

      return dateTime;
    }


  }

  return cLog;

});