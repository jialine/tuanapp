/**
*	AbstractModel abstract class
*	File:	c.Model.js
*	Author:	ouxingzhi@vip.qq.com
*	Date:	2013/6/23
* update: l_wang
* Date: 2013/12/25(OD快快好来，祝圣诞快乐)
*/
define(['libs', 'cBase', 'cStore', 'cAjax', 'cUtility'], function (libs, cBase, AbstractStore, cAjax, cUtility) {
  var cObject = cUtility.Object;
  var AbstractModel = new cBase.Class({
    __propertys__: function () {
      /* 子类需要复写的字段 */
      /**
      * {String} 必填，数据读取url
      */
      this.url = null;
      /**
      * {Object|Store} 必选，用于存贮请求参数
      */
      this.param = null;
      /**
      * {Store} 可选，
      */
      this.result = null;
      /**
      * {Function} 可选，数据返回时的自定义格式化函数
      */
      this.dataformat = null;

      /**
      * {Function} 可选，存放用于验证的函数集合
      */
      this.validates = [];

      // 加入debug模式
      this.debug = false;

      /**
      * {String} 可覆盖，通讯协议
      */
      this.protocol = 'http';

      /**
      * {Boolean} 可选，只通过ajax获取数据
      */
      this.ajaxOnly = false;
      /**
      * {String} 可选，提交数据格式
      */
      this.contentType = AbstractModel.CONTENT_TYPE_JSON;
      /**
      * {String} 可选， 提交数据的方法
      */
      this.method = 'POST';

      //当前的ajax对象
      this.ajax;
      //是否主动取消当前ajax
      this.isAbort = false;

      //参数设置函数
      this.OptionHanders = [];
    },
    initialize: function (options) {
      this.assert();
      this.setOption(function (key, value) {
        switch (key) {
          case 'ajaxOnly':
          case 'contentType':
          case 'debug':
            this[key] = value;
        }
      });
      this.__setOption(options);

    },
    assert: function () {
      if (this.url === null) {
        throw 'not override url property';
      }
      if (this.param === null) {
        throw 'not override param property';
      }
    },
    setOption: function (handler) {
      if (typeof handler === 'function') {
        this.OptionHanders.push(handler);
      }
    },
    pushValidates: function (handler) {
      if (typeof handler === 'function') {
        this.validates.push($.proxy(handler, this));
      }
    },
    __setOption: function (ops) {
      for (var i in ops) {
        for (var t = 0, len = this.OptionHanders.length; t < len; t++) {
          this.OptionHanders[t](i, ops[i]);
        }
      }
    },
    /**
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
    /**
    * 设置结果存取器
    */
    setResultStore: function (result) {
      if (typeof result !== 'object') throw 'Set result is not a store';
      this.result = result;
    },
    /**
    * 清空结果数据
    */
    clearResult: function () {
      if (this.result && typeof this.result.remove === 'function') {
        this.result.remove();
      }
    },
    /**
    *	获得提交
    *	@param void
    *	@return {Object} 返回一个Object
    */
    getParam: function () {
      return this.param instanceof AbstractStore ? this.param.get() : this.param;
    },

    //构建url请求方式，子类可复写，我们的model如果localstorage设置了值便直接读取，但是得是非正式环境
    buildurl: function () {
      var baseurl = this.baseurl();
      return this.protocol + '://' + baseurl.domain + '/' + baseurl.path + (typeof this.url === 'function' ? this.url() : this.url);
    },
    baseurl: function () {
      var host = location.host,
            domain = 'waptest.ctrip.com',
            path = 'restapi2';


      //l_wang 测试环境模式下可以使用自己需要的url请求数据，此处需要做线上区分，如果是线上的话禁止使用该功能
      //由localstorage读取数据
      //      if (!host.match(/^m\.ctrip\.com/i)) {
      //        return {
      //          'domain': domain,
      //          'path': path
      //        };
      //      }

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

    /**
    *	取model数据
    *	@param {Function} onComplete 取完的回调函
    *	传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
    *	@param {Function} onError 发生错误时的回调
    *	@param {Boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
    *   @param {Boolean} scope 可选，设定回调函数this指向的对象
    *   @param {Function} onAbort 可选，但取消时会调用的函数
    */
    execute: function (onComplete, onError, ajaxOnly, scope, onAbort, tag) {
      var params = _.clone(this.getParam() || {});
      var data = this.result && this.result.get(tag), __onCompete, __onError, url = this.buildurl();
      this.isAbort = false;
      var self = this;
      //有下列情况，会直接请求ajax
      if (!data || this.ajaxOnly || ajaxOnly) {
        __onCompete = $.proxy(function (data) {
          var fdata = data, validateSuc = true;
          if (typeof this.dataformat === 'function') {
            fdata = this.dataformat(data);
          }
          //此处做数据验证，如果数据验证不通过则执行错误方法，需要验证的可能不止一个
          if (this.validates) {
            for (var i = 0, len = this.validates.length; i < len; i++) {
              if (!this.validates[i](data)) {
                //如果一个验证不通过就返回false
                validateSuc = false;
                break;
              }
            }
          }
          if (validateSuc) {
            //如果定义localstorage则存入数据
            this.result && this.result.set(fdata, tag);
            onComplete && onComplete.call(scope || this, fdata, data);
          } else {
            onError && onError.call(scope || this, data);
          }
        }, this);
        __onError = $.proxy(function (e) {
          if (self.isAbort) {
            self.isAbort = false;
            onAbort && onAbort.call(scope || this, e);
            return;
          }
          onError && onError.call(scope || this, e);
        }, scope || this);
        if (this.contentType === AbstractModel.CONTENT_TYPE_JSON) {
          this.ajax = cAjax.cros(url, this.method, params, __onCompete, __onError);
        } else if (this.contentType === AbstractModel.CONTENT_TYPE_JSONP) {
          this.ajax = cAjax.jsonp(url, params, __onCompete, __onError);
        } else {
          this.ajax = cAjax.post(url, params, __onCompete, __onError);
        }
      } else {
        onComplete.call(scope || this, data);
      }
    },
    abort: function () {
      this.isAbort = true;
      this.ajax && this.ajax.abort && this.ajax.abort();
    }
  });
  /**
  * 获得model的实例
  */
  AbstractModel.getInstance = function () {
    if (this.instance instanceof this) {
      return this.instance;
    } else {
      return this.instance = new this;
    }
  };
  /** ajax提交数据的格式，目前后面可能会有两种提交格式：json数据提交,form表单方式 **/
  AbstractModel.CONTENT_TYPE_JSON = 'json';
  AbstractModel.CONTENT_TYPE_FORM = 'form';
  AbstractModel.CONTENT_TYPE_JSONP = 'jsonp';
  return AbstractModel;
});


