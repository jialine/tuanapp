/**
*	AbstractModel abstract class
*	File:	c.Model.js
*	Author:	ouxingzhi@vip.qq.com
*	Date:	2013/6/23
*  update: l_wang(20131225)
*/
define(['libs', 'cBase', 'cStore', 'cAjax', 'cUtility', 'CommonStore', 'cAbtractModel', 'cStorage'], function (libs, cBase, AbstractStore, cAjax, cUtility, CommonStore, baseModel, cStorage) {
  var cObject = cUtility.Object;
  var AbstractModel = new cBase.Class(baseModel, {
    __propertys__: function () {
      /**
      * {Boolean} 可覆盖，提交参数是否加入head
      */
      this.usehead = true;
      //head数据
      this.head = CommonStore.HeadStore.getInstance();

      // @param {Boolean} 可选，只通过ajax获取数据，不做localstorage数据缓存
      this.ajaxOnly = false;
    },
    initialize: function ($super, options) {
      $super(options);
    },

    setHead: function (head) {
      if (!head instanceof AbstractStore) {
        throw 'Set head is not a store';
      }
      this.head = head;
    },
    getHead: function () {
      return this.head;
    },

    /**
    *  获得参数存储器
    */
    getParamStore: function () {
      return this.param;
    },
    /**
    * 设置参数存取器
    */
    setParamStore: function (param) {
      if (typeof param !== 'object') throw 'Set param is not a store';
      this.param = param;
    },
    /**
    *  获得结果存储器
    */
    getResultStore: function () {
      return this.result;
    },

    //     @deprecated
    //     没有找到使用setResultStore方法的地方
    //     
    //     设置结果存取器
    //    setResultStore: function (result) {
    //      if (typeof result !== 'object') throw 'Set result is not a store';
    //      this.result = result;
    //    },

    /**
    * 清空结果数据
    */
    clearResult: function () {
      if (this.result && typeof this.result.remove === 'function') {
        this.result.remove();
      }
    },

    /**
    * 重写父类
    *	设置提交参数
    *	@param {String} param 提交参数
    *	@return void
    */
    setParam: function (key, val) {
      var param = {};
      if (typeof key === 'object' && !val) {
        param = key;
      } else {
        param[key] = val;
      }
      for (var i in param) {
        if (this.param instanceof AbstractStore) {
          this.param.setAttr(i, param[i]);
        } else {
          cObject.set(this.param, i, param[i]);
        }
      }
    },

    //重写父类
    getParam: function () {
      return this.param instanceof AbstractStore ? this.param.get() : this.param;
    },

    baseurl: function () {
      var host = location.host;
      var domain = 'waptest.ctrip.com';
      var path = 'restapi2';

      if (cUtility.isInApp()) {
        if (cUtility.isPreProduction() == '1') {   // 定义堡垒环境
          if (this.protocol == "https") {
            domain = 'restful.m.ctrip.com';
          } else {
            domain = 'm.ctrip.com';
          }
        } else if (cUtility.isPreProduction() == '0') {   // 定义测试环境
          if (this.protocol == "https") {
            domain = 'restful.waptest.ctrip.com';
          } else {
            domain = 'waptest.ctrip.com';
          }
        } else {
          if (this.protocol == "https") {
            domain = 'restful.m.ctrip.com';
          } else {
            domain = 'm.ctrip.com';
          }
        }
      } else if (host.match(/^m\.ctrip\.com/i)) {
        domain = 'm.ctrip.com';
      } else if (host.match(/^(localhost|172\.16|127\.0)/i) && (location.protocol == "https" || this.protocol == "https")) {
        //domain =  '10.168.147.3';
        domain = 'restful.waptest.ctrip.com';
      } else if (host.match(/^(localhost|172\.16|127\.0)/i)) {
        if (this.protocol == "https") {
          domain = 'restful.waptest.ctrip.com';
        } else {
          domain = 'waptest.ctrip.com';
        }
      } else if (host.match(/^10\.8\.2\.111/i)) {
        domain = '10.8.2.111';
      } else if (host.match(/^waptest\.ctrip|^210\.13\.100\.191/i) && (location.protocol == "https" || this.protocol == "https")) {
        domain = 'restful.waptest.ctrip.com';
      } else if (host.match(/^waptest\.ctrip|^210\.13\.100\.191/i)) {
        domain = 'waptest.ctrip.com';
      } else {
        domain = 'm.ctrip.com';
      }
      return {
        'domain': domain,
        'path': path
      }
    },

    buildurl: function () {
      var temp_requrl = cStorage.localStorage.get("TEMP_REQURL");
      var baseurl = this.baseurl();
      if (temp_requrl && !location.host.match(/^m\.ctrip\.com/i)) {

        var tempArr = temp_requrl.split("/");

        return this.protocol + '://' + tempArr[0] + '/' + (tempArr[1] || baseurl.path) + (typeof this.url === 'function' ? this.url() : this.url);

      }


      return this.protocol + '://' + baseurl.domain + '/' + baseurl.path + (typeof this.url === 'function' ? this.url() : this.url);
    },

    getTag: function () {
      var params = _.clone(this.getParam() || {});
      if (this.isUserData && !params.cid) {
        var user = this.head.userStore;
        params.cid = user.getUserId();
      }
      return JSON.stringify(params);
    },
    /**
    *	取model数据
    *	@param {Function} onComplete 取完的回调函
    *	传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
    *	@param {Function} onError 发生错误时的回调
    *	@param {Boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
    *   @param {Boolean} scope 可选，设定回调函数this指向的对象
    *   @param {Function} onAbort 可选，但取消时会调用的函数
    */
    excute: function (onComplete, onError, ajaxOnly, scope, onAbort) {

      if (this.method.toLowerCase() !== 'get' && this.usehead && this.contentType !== AbstractModel.CONTENT_TYPE_JSONP) {
        this.setParam('head', this.head.get())
      }

      //验证错误码，并且设置新的auth
      this.pushValidates(function (data) {
        var curhead = this.head.get();
        var head = data.head;
        if (this.contentType !== AbstractModel.CONTENT_TYPE_JSONP && this.usehead && head.auth && head.auth !== curhead.auth) {
          this.head.setAuth(head.auth);
        }
        if (head && head.errcode === 0) {
          return true;
        } else {
          return false;
        }
      });

      // @description 业务相关，获得localstorage的tag
      var tag = this.getTag();
      // @description 业务相关，从localstorage中获取上次请求的数据缓存
      var cache = this.result && this.result.get(tag);

      if (!cache || this.ajaxOnly || ajaxOnly) {

        this.onBeforeCompleteCallback = function (datamodel) {
          if (this.result instanceof AbstractStore) {
            this.result.set(datamodel, tag);
          }
        }
        this.execute(onComplete, onError, scope, onAbort)

      } else {
        if (typeof onComplete === 'function') {
          onComplete.call(scope || this, cache);
        }
      }

    }
  });

  return AbstractModel;
});


