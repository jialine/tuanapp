/**********************************
 * @deprecated from H5V2.2S5
 **********************************

/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  组件Publisher
 *
 * 将WebApp部分接口暴露出来，绑定在window对象上
 */
define(['cUtility', 'cWidgetFactory', 'CommonStore'], function(Util, WidgetFactory, CommonStore){
  "use strict";

  var WIDGET_NAME = 'Publisher';

  var appLock = false;

  // 如果WidgetFactory已经注册了HeaderView，就无需重复注册
  if (WidgetFactory.hasWidget(WIDGET_NAME)) {
    return;
  }

  var Publisher = Publisher || {};

  // defaultFn.register会注册的Handler
  var defaultRegisterHandler = {

    non_member_login: function(options){
      defaultCallback.non_member_login = function(params){
        options.callback(params);
      }
    },

    locate: function(options){
      defaultCallback.locate = function(params){
        try{
          var data = params;
          if (typeof params === 'string') {
            data = JSON.parse(params);
          }

          options.success(data);

        }catch(e){
          options.error(true, '定位失败');
        };
      };
    },

    login: function(options){
      defaultCallback.login = function(params){

        if (typeof params === 'string') {
          params = JSON.parse(params);
        }

        var userStore = CommonStore.UserStore.getInstance();
        var userInfo = userStore.getUser();
        userStore.setUser(params.data);

        var headStore = CommonStore.HeadStore.getInstance();
        var headInfo = headStore.get();
        headInfo.auth = params.data.Auth;
        headStore.set(headInfo);

        // userStore.getUser();

        if (typeof options.success === 'function') {
          options.success();
        }
      }
    },

    back: function(options){
      defaultCallback.back = options.callback;
    },

    commit: function(options){
      defaultCallback.commit = options.callback;
    }
  };

  // defaultFn.callback会调用的不同的Callback
  var defaultCallback = {
    refresh: function(){
      window.location.reload();
    }
  };

  // defaultFn.callback会调用的不同的Handler
  var defaultHandler = {
    non_member_login: function(options){
      if (typeof defaultCallback.non_member_login === 'function') {
        defaultCallback.non_member_login(options);
      };
    },

    locate: function(options){
      if(typeof defaultCallback.locate === 'function'){
        defaultCallback.locate(options);
      }
    },

    login: function(params){
      if(typeof defaultCallback.login === 'function'){
        defaultCallback.login(params);
      }
    },

    back: function(){
      if(typeof defaultCallback.back === 'function'){
        defaultCallback.back();
      }
    },

    commit: function(){
      if(typeof defaultCallback.commit === 'function'){
        defaultCallback.commit();
      }
    }
  };

  var _urldecode = function(str){
    var tempStr = str.replace(/\+/g, '%20');
    return window.decodeURIComponent(tempStr);

    //return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () {
    //    return '%25';
    //}).replace(/\+/g, '%20'));
  };

  // 定义好的需要绑定在window上的方法
  var defaultFn = {
    callback: function(param){

      if (appLock) return;

      var options = param;
      if (typeof(param) === "string") {
        try{
          options = JSON.parse(window.decodeURIComponent(param));
          // param = _urldecode(param);
          // options = JSON.parse(param);
        }catch(e){
          setTimeout(function() {console.error('参数错误');}, 0);
        }
      }

      document.activeElement.blur();

      // alert(param);

      if(typeof defaultHandler[options.tagname] === 'function'){
        defaultHandler[options.tagname](options.param);
      }
    },
  };

  var _registerFn = function(facade){
    for(var key in defaultFn){
      facade[key] = facade[key] || defaultFn[key];
    }
  };

  // ------------------------------------------------
  // --------------定义Publisher具体暴露的API--------

  Publisher.setApi = function(){
    if (Util.isInApp()) {
      var app = window.app = window.app || {};
      _registerFn(app);
    }
  };

  // 调用defaultRegisterHandler将回调方法写到defaultCallback中
  Publisher.register= function(options){
    if (Util.isInApp() && typeof defaultRegisterHandler[options.name] === 'function'){
      defaultRegisterHandler[options.name](options);
    }
  };

  Publisher.lock = function(){
    if (Util.isInApp()) {
      appLock = true;
    }
  };

  Publisher.unlock = function(){
    if (Util.isInApp()) {
      appLock = false;
    };
  };

  Publisher.requestEntryInfo = function(){
    if (Util.isInApp()) {
      app_entry();
    }
  };

  Publisher.requestAnomyousUser = function(){
    if (Util.isInApp()) {
      app_non_member_login();
    }
  };

  // 订单填写页|非登陆状态出现登陆按钮 ====== "UseCarNeedLogin"
  // 送达地点|常用地址    =================== "UseCarCommonAddresses"
  Publisher.monitor = function(eventName){
    if (Util.isInApp()) {
      app_log_event(eventName);
    }
  };

  Publisher.sendHotelInfo = function(hotelId, name, cityId, isOverSea){
    if (Util.isInApp()) {
      app_go_to_hotel_detail(hotelId, name, cityId, isOverSea);
    }
  };

  Publisher.requestAutoLogin = function(){
    if (Util.isInApp()) {
      app_member_auto_login();
    }
  };

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: Publisher
  });
});
