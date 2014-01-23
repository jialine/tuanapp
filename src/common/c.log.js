/**
 * @author zsb张淑滨 <shbzhang@Ctrip.com> / ghj龚汉金 <hjgong@Ctrip.com>
 * @class cLog
 * @description 提供App在手机端的后门
 * @comment 需要zsb与新代码再核对一遍
 */
define(['libs'], function () {

  "use strict";

  /** 声明cLog命名空间 */
  var cLog = {};

  var _parse = function(obj){
    if (JSON.stringify) {
      return JSON.stringify(obj);
    } else {
      return eval('(' + obj + ')');
    }
  };

  /**
   * @method _getDateTime
   * @description 格式化当前gr时间
   */
  var _getDateTime = function () {
    var date = new Date();
    var dateTime = "";
    dateTime += date.getMonth() + 1;
    dateTime += '/';
    dateTime += date.getDate();
    dateTime += ' ';
    dateTime += date.getHours();
    dateTime += ':';
    dateTime += date.getMinutes();
    dateTime += ':';
    dateTime += date.getSeconds();

    return dateTime;
  };

  /**
   * @method _isExistServerLog
   * @description 判断当前是不是打开了serverlog
   */
  var _isExistServerLog = function(){
    var _logFlag = false;
    var cfgStore = window.localStorage.getItem('H5_CFG');
    if(cfgStore){
      _logFlag = JSON.parse(cfgStore).value.serverLog;
    }
    return !!_logFlag;
  };

  /** 判断H5_CFG的serverlog是不是开始记录 */
  cLog.serverlog = _isExistServerLog(window);

  /**
   * @method cLog.errorlog
   * @param {string} errorMsg 错误信息Message
   * @param {string} errorFileUrl 错误文件
   * @param {int} 错误代码的行数
   * @return {boolean}
   */
  cLog.errorlog = function(errorMsg, errorFileUrl, lineNum){
    var error = cLog.buildErrorObj(errorMsg, errorFileUrl, lineNum);
    cLog.pushLog('ERROR_LOG',error);
    return false;
  };

  /**
   * @method cLog.urllog
   * @param {string} url
   * @description 保存url history
   */
  cLog.urllog = function(url){
    if(url.indexOf('monitor') > -1) return;

    var data = {
      url: url,
      dt: this.getDateTime()
    };

    cLog.pushLog('URL_LOG',data);
  };

  /**
   * @method cLog.restlog
   * @param {string} url
   * @param {string} request request的string值
   * @param {string} response response的string值
   * @description 重置Log
   */
  cLog.restlog = function(url,request,response){
    if(! this.serverLog) return;

    var data = {
      url : url,
      rspCode: response?'200':'404',
      req: request,
      rsp: response,
      dt: this.getDateTime()
    };

    this.pushLog('SERVER_LOG',data);
  };

  /**
   * @method cLog.restlog
   * @param {string} name log的key名称
   * @param {string} param 具体写入log的信息
   * @description 重置Log
   */
  cLog.applog = function(name,param){
    var logStore = localStorage.getItem('APP_LOG') ;
    var appLog = logStore ? JSON.parse(logStore) : {};

    appLog[name] ={
      data : param,
      dt: this.getDateTime()
    };

    logStr = _parse(appLog);
    localStorage.setItem('APP_LOG', logStr);
  };

  /**
   * @method cLog.buildErrorObj
   * @param {string} errorMsg 错误信息Message
   * @param {string} errorFileUrl 错误文件
   * @param {int} 错误代码的行数
   * @return {JSON}
   */
  cLog.buildErrorObj = function (errorMsg, errorFileUrl, lineNum) {
    var fileName = typeof errorFileUrl =='string' ? errorFileUrl.substr(errorFileUrl.lastIndexOf('/') + 1):'';

    /** 保存Error 错误调用堆栈 */
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
  };

  /**
   * @method cLog.pushLog
   * @param {string} logName log名
   * @param {string} logItem
   * @description 保存Log对象
   */
  cLog.pushLog = function (logName,logItem) {
    var logStore = localStorage.getItem(logName),
      logStr = [];
    var logStack = logStore ? JSON.parse(logStore) : [];

    /** 如果大于50条,删除最早的记录 */
    if (logStack.length > 0) {
      logStack.splice(50);
    }

    /** 新的记录放在数组的头部 */
    logStack.unshift(logItem);

    /** 序列化 */
    logStr = _parse(logStack);
    localStorage.setItem(logName, logStr);
  };


  window.onerror = function (errorMsg, errorFileUrl, lineNum) {
    cLog.errorLog(errorMsg, errorFileUrl, lineNum);
  };

  window.onload = function(){
    cLog.urlLog(window.location.href);
  };

  window.onhashchange = function(){
    cLog.urlLog(window.location.href);
  };

  // var cLog = {

    // serverLog : (function(){
    //   var _logFlag = false;
    //   var cfgStore = localStorage.getItem('H5_CFG');
    //   if(cfgStore){
    //     _logFlag = JSON.parse(cfgStore).value.serverLog;
    //   }
    //   return !!_logFlag;
    // })(),
    /**
     * 保存error信息
     * @param errorMsg
     * @param errorFileUrl
     * @param lineNum
     * @returns {boolean}
     */
    // errorLog: function (errorMsg, errorFileUrl, lineNum) {
    //   var error = this.buildErrorObj(errorMsg, errorFileUrl, lineNum);
    //   this.pushLog('ERROR_LOG',error);
    //   return false;
    // },

    /**
     * 保存url history
     * @param url
     */
    // urlLog:function(url){
    //   if(url.indexOf('monitor')>-1){
    //     return;
    //   }
    //   var data = {
    //     url :url,
    //     dt: this.getDateTime()
    //   };
    //   this.pushLog('URL_LOG',data);
    // },


    // restlog:function(url,request,response){
    //   if(! this.serverLog){
    //     return;
    //   }
    //   var data = {
    //     url : url,
    //     rspCode: response?'200':'404',
    //     req: request,
    //     rsp: response,
    //     dt: this.getDateTime()
    //   }
    //   this.pushLog('SERVER_LOG',data);
    // },

    // applog:function(name,param){
    //   var logStore = localStorage.getItem('APP_LOG') ;
    //   var appLog = logStore ? JSON.parse(logStore) : {};
    //   appLog[name] ={
    //     data : param,
    //     dt: this.getDateTime()
    //   }

    //   if (JSON.stringify) {
    //     logStr = JSON.stringify(appLog);
    //   } else {
    //     logStr = eval('(' + appLog + ')');
    //   }

    //   localStorage.setItem('APP_LOG', logStr);
    // },

    // buildErrorObj: function (errorMsg, errorFileUrl, lineNum) {
    //   var fileName = typeof errorFileUrl =='string' ? errorFileUrl.substr(errorFileUrl.lastIndexOf('/') + 1):'';
    //   //保存Error 错误调用堆栈
    //   return {
    //     msg:      errorMsg,
    //     file:     fileName,
    //     line:     lineNum,
    //     fullPath: errorFileUrl,
    //     dt:       this.getDateTime(),
    //     url:      window.location.href,
    //     restful:  {
    //       url:      '',
    //       request:  '',
    //       response: ''
    //     }
    //   };
    // },

    /**
     * 保存Log对象
     * @param errorObj
     */
    // pushLog: function (logName,logItem) {
    //   var logStore = localStorage.getItem(logName),
    //     logStr = [];
    //   var logStack = logStore ? JSON.parse(logStore) : [];
    //   //如果大于50条,删除最早的记录
    //   if (logStack.length > 0) {
    //     logStack.splice(50)
    //   }
    //   //新的记录放在数组的头部
    //   logStack.unshift(logItem);
    //   //序列化
    //   if (JSON.stringify) {
    //     logStr = JSON.stringify(logStack);
    //   } else {
    //     logStr = eval('(' + logStack + ')');
    //   }

    //   localStorage.setItem(logName, logStr);
    // },

    /**
     * 格式化当前gr时间
     * @returns {number}
     */
    // getDateTime: function () {
    //   var d = new Date();
    //   var dateTime = "";
    //   dateTime += d.getMonth() + 1;
    //   dateTime += '/';
    //   dateTime += d.getDate();
    //   dateTime += ' ';
    //   dateTime += d.getHours();
    //   dateTime += ':';
    //   dateTime += d.getMinutes();
    //   dateTime += ':';
    //   dateTime += d.getSeconds();

    //   return dateTime;
    // }
  // }

  return cLog;

});