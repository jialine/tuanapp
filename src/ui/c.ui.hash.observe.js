/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUIHashObserve
* @description 观察hash变化
*/
define(['libs', 'cBase', 'cUIAbstractView'], function (libs, cBase) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  /** 相关属性 */
  options.__propertys__ = function () {
    this.hash;
    this.callback;
    this._hashchange = $.proxy(function () {
      this.hashchange();
    }, this);
    this.isend = true;
    this.scope;
  };

  /**
  * @method initialize
  * @param opts {object}        构造函数（实例化）传入的参数
  * @description 构造函数入口
  */
  options.initialize = function (opts) {
    this.setOption(opts);
  };

  /**
  * @method setOption
  * @param options {Object}        参数对象
  * @description 设置基本属性
  */
  options.setOption = function (options) {
    var allowOptions = { hash: true, callback: true, scope: true };
    for (var i in options) {
      switch (true) {
        case allowOptions[i]:
          this[i] = options[i];
          break;
      }
    }
  };

  /**
  * @method start
  * @description 开启监控
  */
  options.start = function () {
    this.isend = false;
    window.location.hash += '|' + this.hash;
    $(window).bind('hashchange', this._hashchange);
  };

  /**
  * @method end
  * @description 结束监控
  */
  options.end = function () {
    $(window).unbind('hashchange', this._hashchange);
    if (!this.isend) {
      this.isend = true;
      window.history.go(-1);
    }
  };

  /**
  * @method hashchange
  * @description hash变化时候执行的方法
  */
  options.hashchange = function () {
    var hash = window.location.hash;
    if (!hash.match(new RegExp('\\b' + this.hash + '\\b', 'ig'))) {
      this.isend = true;
      this.callback.call(this.scope || this);
      this.end();
    }
  };

  return new cBase.Class(options);

});