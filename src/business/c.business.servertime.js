/**
 * @author cmli@ctrip.com / vzyq张有泉 <yq.zhang@Ctrip.com>
 * @class cBusinessServertime
 * @description 获取服务器时间
 */
define(['cWidgetFactory', 'cWidgetGuider'], function(WidgetFactory) {

  var Guider = WidgetFactory.create('Guider');

  /**
   * @deprecated
   * @method _isInApp
   * @description 此处 _isInApp 与 c.utility.isInApp 相冗余，因当前cbase 与 utility 存在循环引用问题，故此暂时保留
   * @todo 用 cUtility.isInApp 代替
   */
  var _isInApp = function() {
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

  var BusinessServertime = {};

  /**
   * @method BusinessServertime.getServerDate
   * @param {function} callback
   * @description 获取服务端时间
   */
  BusinessServertime.getServerDate = function(callback) {

    var applyCallback = function(date) {
      if (typeof callback === 'function') {
        return callback(date);
      }

      return date;
    };

    /** 在App层调用的回调部分 */
    var hybridCallback = function() {

      var now = new Date();
      var serverdate = window.localStorage.getItem('SERVERDATE');

      /** 如果没有从LocalStorage中获得数据直接返回 */
      if (!serverdate) {
        return applyCallback(now);
      }

      /** servertime的计算逻辑：第一次进入取本地时间和服务器时间的差值，保存差值。每次再取差值加上本地时间，计算出服务端时间 */
      try {
        serverdate = JSON.parse(serverdate);
        if (serverdate && serverdate.server && serverdate.local) {
          var servertime = window.parseInt(serverdate.server);
          var localtime = window.parseInt(serverdate.local);
          var currenttime = (new Date()).getTime();
          var cServertime = new Date(servertime + currenttime - localtime);

          return applyCallback(cServertime);
        } else {
          return applyCallback(now);
        }
      } catch (e) {

        return applyCallback(now);
      }
    };

    /** 在Web层调用的回调 */
    var webCallback = function() {
      if (location.pathname.match(/^\/?html5/i)) {

        return applyCallback(now);
      } else {

        if (typeof __SERVERDATE__ === 'undefined' || !__SERVERDATE__.server) {
          console.log("无服务端时间参考，请在html入口文件添加指向'/html5/ClientData/LoadServerDate'的script标签");

          return applyCallback(now);
        }

        /** 计算server time的时间  */
        var servertime = new Date(__SERVERDATE__.server.valueOf() + (new Date().valueOf() - __SERVERDATE__.local.valueOf()));
        return applyCallback(servertime);
      }
    };

    Guider.apply({
      hybridCallback: hybridCallback,
      callback: webCallback
    });
  };

  return BusinessServertime;
});