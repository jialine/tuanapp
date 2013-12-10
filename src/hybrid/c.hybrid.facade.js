/**********************************
 * @author:     cmli@Ctrip.com
 * @description:  hybrid面板模板
 */
define(['libs', 'CommonStore'], function(libs, CommonStore){

  var Facade = Facade || {};

  Facade.METHOD_ENTRY = 'METHOD_ENTRY';
  Facade.METHOD_MEMBER_LOGIN = 'METHOD_MEMBER_LOGIN';
  Facade.METHOD_NON_MEMBER_LOGIN = 'METHOD_NON_MEMBER_LOGIN';
  Facade.METHOD_AUTO_LOGIN = 'METHOD_AUTO_LOGIN';
  Facade.METHOD_LOCATE = 'METHOD_LOCATE';
  Facade.METHOD_REFRESH_NAV_BAR = 'METHOD_REFRESH_NAV_BAR';
  Facade.METHOD_CALL_PHONE = 'METHOD_CALL_PHONE';
  Facade.METHOD_BACK_TO_HOME = 'METHOD_BACK_TO_HOME';
  Facade.METHOD_BACK_TO_BOOK_CAR = 'METHOD_BACK_TO_BOOK_CAR';
  Facade.METHOD_BACK = 'METHOD_BACK';
  Facade.METHOD_COMMIT = 'METHOD_COMMIT';
  Facade.METHOD_REGISTER = 'METHOD_REGISTER';
  Facade.METHOD_LOG_EVENT = 'METHOD_LOG_EVENT';
  Facade.METHOD_INIT = 'METHOD_INIT';
  Facade.METHOD_CALL_SERVICE_CENTER = 'METHOD_CALL_SERVICE_CENTER';
  Facade.METHOD_BACK_TO_LAST_PAGE = 'METHOD_BACK_TO_LAST_PAGE';
  Facade.METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE = 'METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE';
  Facade.METHOD_GO_TO_HOTEL_DETAIL = 'METHOD_GO_TO_HOTEL_DETAIL';
  Facade.METHOD_OPEN_URL = 'METHOD_OPEN_URL';
  Facade.METHOD_CHECK_UPDATE = 'METHOD_CHECK_UPDATE';
  Facade.METHOD_RECOMMEND_APP_TO_FRIEND ='METHOD_RECOMMEND_APP_TO_FRIEND';
  Facade.METHOD_ADD_WEIXIN_FRIEND = 'METHOD_ADD_WEIXIN_FRIEND';
  Facade.METHOD_SHOW_NEWEST_INTRODUCTION = 'METHOD_SHOW_NEWEST_INTRODUCTION';
  Facade.METHOD_BECOME_ACTIVE = 'METHOD_BECOME_ACTIVE';
  Facade.METHOD_WEB_VIEW_FINISHED_LOAD = 'METHOD_WEB_VIEW_FINISHED_LOAD';
  Facade.METHOD_CROSS_DOMAIN_HREF = 'METHOD_CROSS_DOMAIN_HREF';
  Facade.METHOD_CHECK_APP_INSTALL = 'METHOD_CHECK_APP_INSTALL';
  Facade.METHOD_CROSS_JUMP = 'METHOD_CROSS_JUMP';
  Facade.METHOD_REFRESH_NATIVE = 'METHOD_REFRESH_NATIVE';
  Facade.METHOD_H5_NEED_REFRESH = 'METHOD_H5_NEED_REFRESH';

  var METHOD_ENTRY = 'h5_init_finished';
  var METHOD_MEMBER_LOGIN = 'member_login';
  var METHOD_NON_MEMBER_LOGIN = 'non_member_login';
  var METHOD_AUTO_LOGIN = 'member_auto_login';
  var METHOD_LOCATE = 'locate';
  var METHOD_REFRESH_NAV_BAR = 'refresh_nav_bar';
  var METHOD_BACK = 'back';
  var METHOD_COMMIT = 'commit';
  var METHOD_REGISTER = 'member_register';
  var METHOD_INIT = 'init_member_H5_info';
  var METHOD_BECOME_ACTIVE = 'become_active';
  var METHOD_WEB_VIEW_FINISHED_LOAD = 'web_view_finished_load';
  var METHOD_CHECK_APP_INSTALL = 'check_app_install_status';
  var METHOD_H5_NEED_REFRESH = 'app_h5_need_refresh';

  var appLock = false;

  // defaultFn.register会注册的Handler
  var defaultRegisterHandler = {

    METHOD_NON_MEMBER_LOGIN: function (options) {
      defaultCallback[METHOD_NON_MEMBER_LOGIN] = function (params) {
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

        if (typeof options.callback === 'function') {
          options.callback(params);
        }

        //options.callback(params);
      }
    },

    METHOD_LOCATE: function(options){
      defaultCallback[METHOD_LOCATE] = function(params){
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

    METHOD_MEMBER_LOGIN: function (options) {
      defaultCallback[METHOD_MEMBER_LOGIN] = function(params){

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

        if (typeof options.callback === 'function') {
          options.callback();
        }
      }
    },

    METHOD_AUTO_LOGIN: function (options) {
      defaultCallback[METHOD_AUTO_LOGIN] = function (params) {

        if (typeof params === 'string') {
          params = JSON.parse(params);
        }

        if (params) {
          var userStore = CommonStore.UserStore.getInstance();
          var userInfo = userStore.getUser();
          userStore.setUser(params.data);

          var headStore = CommonStore.HeadStore.getInstance();
          var headInfo = headStore.get();
          headInfo.auth = params.data.Auth;
          headStore.set(headInfo);
        }
      }
    },

    METHOD_REGISTER: function(options){
      defaultCallback[METHOD_REGISTER] = function(params){

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

        if (typeof options.callback === 'function') {
          options.callback();
        }
      }
    },

    METHOD_ENTRY: function(options){
      defaultCallback[METHOD_ENTRY] = options.callback;
    },

    METHOD_BACK: function(options){
      defaultCallback[METHOD_BACK] = options.callback;
    },

    METHOD_COMMIT: function(options){
      defaultCallback[METHOD_COMMIT] = options.callback;
    },

    METHOD_INIT: function(options){
      defaultCallback[METHOD_INIT] = function (params) {

        if (typeof params === 'string') {
          params = JSON.parse(params);
        }

        if (window.localStorage && params) {
          // 设置用户信息
          if (params && params.userInfo) {
            try{
              var userStore = CommonStore.UserStore.getInstance();
              var userInfo = userStore.getUser();
              userStore.setUser(params.userInfo.data);

              var headStore = CommonStore.HeadStore.getInstance();
              var headInfo = headStore.get();
              headInfo.auth = params.userInfo.data.Auth;
              headStore.set(headInfo);
            } catch (e) {
              alert('set data error');
            }
          }

          // 设置DeviceInfo
          if (params && params.device) {
            var deviceInfo = {
              device: params.device
            }
            window.localStorage.setItem('DEVICEINFO', JSON.stringify(deviceInfo));
          }

          // 设置AppInfo
          if (params && params.appId) {
            var appInfo = {
              version: params.version,
              appId: params.appId,
              serverVersion: params.serverVersion,
              platform: params.platform
            }
            window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
          }

          if (params && params.timestamp) {
            window.localStorage.setItem('SERVERDATE', params.timestamp);
          }

          if (params && params.sourceId) {
            window.localStorage.setItem('SOURCEID', params.sourceId);
          }

          if (params && params.isPreProduction) {
            window.localStorage.setItem('isPreProduction', params.isPreProduction);
          }
        }

        options.callback();
      }
    },

    METHOD_WEB_VIEW_FINISHED_LOAD: function(options){
      defaultCallback[METHOD_WEB_VIEW_FINISHED_LOAD] = options.callback;
    },

    METHOD_BECOME_ACTIVE: function(options){
      defaultCallback[METHOD_BECOME_ACTIVE] = options.callback;
    },

    METHOD_CHECK_APP_INSTALL: function (options) {
      defaultCallback[METHOD_CHECK_APP_INSTALL] = function (params) {
        options.callback(params);
      }
    },

    METHOD_H5_NEED_REFRESH: function (options) {
      defaultCallback[METHOD_H5_NEED_REFRESH] = options.callback;
    }
  };

  // defaultFn.callback会调用的不同的Callback
  var defaultCallback = {};

  // defaultFn.callback会调用的不同的Handler
  var defaultHandler = {
    h5_init_finished: function(options){
      if (typeof defaultCallback[METHOD_ENTRY] === 'function') {
        defaultCallback[METHOD_ENTRY](options);
      };
    },

    non_member_login: function(options){
      if (typeof defaultCallback[METHOD_NON_MEMBER_LOGIN] === 'function') {
        defaultCallback[METHOD_NON_MEMBER_LOGIN](options);
      };
    },

    locate: function(options){
      if(typeof defaultCallback[METHOD_LOCATE] === 'function'){
        defaultCallback[METHOD_LOCATE](options);
      }
    },

    member_login: function (options) {
      if(typeof defaultCallback[METHOD_MEMBER_LOGIN] === 'function'){
        defaultCallback[METHOD_MEMBER_LOGIN](options);
      }
    },

    back: function(){
      if(typeof defaultCallback[METHOD_BACK] === 'function'){
        defaultCallback[METHOD_BACK]();
      }
    },

    commit: function(){
      if(typeof defaultCallback[METHOD_COMMIT] === 'function'){
        defaultCallback[METHOD_COMMIT]();
      }
    },

    init_member_H5_info: function (options) {
      if(typeof defaultCallback[METHOD_INIT] === 'function'){
        defaultCallback[METHOD_INIT](options);
      }
    },

    member_register: function(){
      if(typeof defaultCallback[METHOD_REGISTER] === 'function'){
        defaultCallback[METHOD_REGISTER]();
      }
    },

    web_view_finished_load: function(){
      if(typeof defaultCallback[METHOD_WEB_VIEW_FINISHED_LOAD] === 'function'){
        defaultCallback[METHOD_WEB_VIEW_FINISHED_LOAD]();
      }
    },

    become_active: function(){
      if(typeof defaultCallback[METHOD_BECOME_ACTIVE] === 'function'){
        defaultCallback[METHOD_BECOME_ACTIVE]();
      }
    },

    member_auto_login: function (options) {
      if (typeof defaultCallback[METHOD_AUTO_LOGIN] === 'function') {
        defaultCallback[METHOD_AUTO_LOGIN](options);
      };
    },

    check_app_install_status: function (options) {
      if (typeof defaultCallback[METHOD_CHECK_APP_INSTALL] === 'function') {
        defaultCallback[METHOD_CHECK_APP_INSTALL](options);
      };
    },

    app_h5_need_refresh: function (options) {
      if (typeof defaultCallback[METHOD_H5_NEED_REFRESH] === 'function') {
        defaultCallback[METHOD_H5_NEED_REFRESH](options);
      };
    }
  };

  // 定义需要绑定在window上的方法
  var defaultFn = {
    callback: function (param) {
      if (appLock) return;

      var options = param;
      if (typeof(param) === "string") {
        try{
          options = JSON.parse(window.decodeURIComponent(param));
        }catch(e){
          setTimeout(function() {console.error('参数错误');}, 0);
        }
      }

      // document.activeElement.blur();

      if(typeof defaultHandler[options.tagname] === 'function'){
        defaultHandler[options.tagname](options.param);
        return true;
      }
    }
  };

  var _registerFn = function(facade){
    for(var key in defaultFn){
      facade[key] = facade[key] || defaultFn[key];
    }
  };

  Facade.init = function(){
    var app = window.app = {};
    _registerFn(app);
  };

  Facade.register= function(options){
    if (typeof defaultRegisterHandler[options.tagname] === 'function'){
      defaultRegisterHandler[options.tagname](options);
    }
  };

  Facade.request = function(options){

    var methods = {

      // 5.2支持初始化
      METHOD_INIT: function(options){
        Facade.register({ tagname: Facade.METHOD_INIT, callback: options.callback });
        CtripUtil.app_init_member_H5_info();
      },

      // 5.1支持初始化
      METHOD_ENTRY: function(options){
        Facade.register({tagname: Facade.METHOD_ENTRY, callback: options.callback});
        CtripUtil.app_entry();
      },

      METHOD_MEMBER_LOGIN: function(options){
        Facade.register({tagname: Facade.METHOD_MEMBER_LOGIN, callback: options.callback});
        CtripUser.app_member_login();
      },

      METHOD_NON_MEMBER_LOGIN: function(options){
        Facade.register({tagname: Facade.METHOD_NON_MEMBER_LOGIN, callback: options.callback});
        CtripUser.app_non_member_login();
      },

      METHOD_AUTO_LOGIN: function(options){
        Facade.register({tagname: Facade.METHOD_AUTO_LOGIN, callback: options.callback});
        CtripUser.app_member_auto_login();
      },

      METHOD_REGISTER: function(options){
        Facade.register({tagname: Facade.ETHOD_REGISTER, callback: options.callback});
        CtripUser.app_member_register();
      },

      METHOD_LOCATE: function(options){
        Facade.register({ tagname: Facade.METHOD_LOCATE, success: options.success, error: options.error });
        var async = true;
        if (options.isAsync) {
          async = options.isAsync;
        }
        CtripUtil.app_locate(async);
      },

      METHOD_REFRESH_NAV_BAR: function(options){
        // Facade.register({tagname: Facade.METHOD_REFRESH_NAV_BAR, callback: options.callback});
        CtripUtil.app_refresh_nav_bar(options.config);
      },

      METHOD_CALL_PHONE: function(options){
        CtripUtil.app_call_phone(options.tel);
      },

      METHOD_BACK_TO_HOME: function(options){
        CtripUtil.app_back_to_home();
      },

      METHOD_BACK_TO_BOOK_CAR: function(options){
        app_back_to_book_car();
      },

      METHOD_LOG_EVENT: function(options){
        CtripUtil.app_log_event(options.event_name)
      },

      METHOD_CALL_SERVICE_CENTER: function(){
        //CtripUtil.app_call_service_center();
        CtripUtil.app_call_phone('400-0886-666');
      },

      METHOD_BACK_TO_LAST_PAGE: function(){
        CtripUtil.app_back_to_last_page();
      },

      METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE: function (options) {
        CtripUtil.app_go_to_book_car_finished_page(options.url);
      },

      METHOD_GO_TO_HOTEL_DETAIL: function (options) {
        CtripUtil.app_go_to_hotel_detail(options.hotelId, options.hotelName, options.cityId, options.isOverSea);
      },

      METHOD_OPEN_URL: function (options) {
        CtripUtil.app_open_url(options.openUrl, options.targetMode, options.title);
      },

      METHOD_CHECK_UPDATE: function (options) {
        CtripUtil.app_check_update();
      },

      METHOD_RECOMMEND_APP_TO_FRIEND: function () {
        CtripUtil.app_recommend_app_to_friends();
      },

      METHOD_ADD_WEIXIN_FRIEND: function () {
        CtripUtil.app_add_weixin_friend();
      },

      METHOD_CROSS_DOMAIN_HREF: function (options) {
        CtripUtil.app_cross_domain_href(options.moduleType, options.anchor, options.param);
      },

      METHOD_SHOW_NEWEST_INTRODUCTION: function (options) {
        CtripUtil.app_show_newest_introduction();
      },

      METHOD_CHECK_APP_INSTALL: function (options) {
        Facade.register({ tagname: Facade.METHOD_CHECK_APP_INSTALL, callback: options.callback });
        CtripUtil.app_check_app_install_status(options.url, options.package);
      },

      METHOD_CROSS_JUMP: function (options) {
        CtripUtil.app_cross_package_href(options.path, options.param);
      },

      METHOD_REFRESH_NATIVE: function (options) {
        CtripUtil.app_refresh_native_page(options.package, options.json);
      }
    }

    methods[options.name](options);
  };

  Facade.getOpenUrl = function(options){

    //var head = 'ctrip://wireless/'+ options.module+'?';
    var url = 'ctrip://wireless/' + options.module + '?';

    // 对参数进行拼接，拼接成url
    _.each(options.param, function (value, key, list) {
      url += (key + '=' + value + '&');
    });

    // 去掉最后一个&
    if (url[url.length -1] === '&') {
      url = url.slice(0, url.length-1);
    };

    //window.location.href = head;
    return url;
  }

  return Facade;

});