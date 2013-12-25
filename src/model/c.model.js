/**
 *	AbstractModel abstract class
 *	File:	c.Model.js
 *	Author:	ouxingzhi@vip.qq.com
 *	Date:	2013/6/23
 *  update: l_wang(20131225)
 */
define(['libs', 'cBase', 'cStore', 'cAjax', 'cUtility', 'CommonStore', 'cAbtractModel'], function (libs, cBase, AbstractStore, cAjax, cUtility, CommonStore, baseModel) {
  var cObject = cUtility.Object;
  var AbstractModel = new cBase.Class(baseModel, {
    __propertys__: function () {
      /**
      * {Boolean} 可覆盖，提交参数是否加入head
      */
      this.usehead = true;
      //head数据
      this.head = CommonStore.HeadStore.getInstance();

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

    buildurl: function () {
      var baseurl = AbstractStore.get("TEMP_REQURL");
      if (baseurl && !location.host.match(/^m\.ctrip\.com/i)) {
        return baseurl;
      }

      baseurl = this.baseurl();
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
      this.execute(onComplete, onError, ajaxOnly, scope, onAbort, this.getTag());
    }
  });

  return AbstractModel;
});


