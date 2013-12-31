define(['cBase', 'cModel', 'cStore', 'cAjax', 'cUtility', 'CommonStore'], function (cBase, cModel, cStore, cAjax, cUtility, CommonStore) {
  "use strict";

  var UserStore = CommonStore.UserStore.getInstance(),
        HeadStore = CommonStore.HeadStore.getInstance();

  var UserModel = {};

  /************************
  * @description: 非会员登录
  * @author: od
  */
  /*UserModel.NotUserLoginModel = new cBase.Class(cModel, {
  __propertys__: function () {
  this.protocol = 'https';
  this.baseurl = cModel.baseurl.call(this);
  this.url = "/User/Nonmember/Login";
  this.param = {
  'ver': 0,
  'uuid': cUtility.getGuid()
  };
  },
  initialize: function ($super, options) {
  $super(options);
  }
  });
  */
  /***************************
  * @description: 验证码
  * @author: od
  */
  //    UserModel.UserVerityModel = function (param, _callback) {
  //        var odata = param;
  //        $.ajax({
  //            url: "/html5/ClientData/GetVerifyCode",
  //            data: odata,
  //            type: "POST",
  //            success: function (d) {
  //                _callback(d);
  //            }
  //        });
  //    }

  UserModel.NotUserLoginModel = new cBase.Class(cModel, {
    __propertys__: function () {
      this.url = "/html5/Account/NonUserLogin";
      this.param = {};
      //l_wang修改
      //            this.baseurl = (this.baseurl && this.baseurl()) && (cModel.baseurl && cModel.baseurl.call(this));

                  this.baseurl = cModel.baseurl.call(this);
//      this.baseurl = this.baseurl();

      this._abortres;
      this.isAbort = false;
    },
    initialize: function ($super, options) {
      $super(options);
    },
    excute: function (onComplete, onError, ajaxOnly, scope, onAbort) {
      this.isAbort = false;
      var url = 'http://' + this.baseurl.domain + this.url;
      this._abortres = $.ajax({
        'type': 'get',
        'url': url,
        'dataType': 'json',
        'crossDomain': true,
        'success': $.proxy(function (data) {
          if (data.ServerCode == 1 && data.Data) {
            UserStore.setUser(data.Data);
            onComplete && onComplete.call(scope, data);
          } else {
            onError && onError.call(scope);
          }
        }, this),
        'error': $.proxy(function () {
          if (this.isAbort) {
            onAbort && onAbort.call(scope);
            this.isAbort = false;
            return;
          }
          onError && onError.apply(scope, arguments);
        }, this),
        'timeout': 25000
      });
    },
    abort: function () {
      this.isAbort = true;
      this._abortres && this._abortres.abort && this._abortres.abort();
    }
  });
  return UserModel;
});