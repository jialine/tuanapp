// @author Michael.Lee
// @email cmli@Ctrip.com

define(['libs', 'cBase', 'cUICore'], function (libs, cBase, cUICore) {

  var options = {};

  var _config = {
    prefix: 'cui-',
    sleep: 2
  };

  var _handler = null;

  var _showHandler = null;
  var _hideHandler = null;

  var _resetClickEvent = function (callback) {
    this.hide();

    if (callback && typeof callback === 'function') {
      callback.call(this);
    }

    $('.cui-opacitymask').unbind('click');
    $('.cui-toast').unbind('click');
  };

  var _setClickToHideEvent = function (clickToHide, callback) {
    var scope = this;
    var _clickCallback = function () {

      // 为什么要先unbind再rebind？
      $('.cui-opacitymask').unbind('click').bind('click', function () {
        _resetClickEvent.call(scope, callback);
      });

      $('.cui-toast').unbind('click').bind('click', function () {
        _resetClickEvent.call(scope, callback);
      });
    }

    if (clickToHide) {
      setTimeout(_clickCallback, 400);
    }
  };

  var _show = function (title, sleep, callback, clickToHide) {
    var scope = this;
    this.setContent(title);

    if (typeof _showHandler === 'function') {
      _showHandler.call(this);
    };

    var _callback = function () {
      _resetClickEvent.call(scope, callback);
    }
    var _timeout = (sleep || _config.sleep) * 1000;
    _handler = setTimeout(_callback, _timeout);

    _setClickToHideEvent.call(this, clickToHide, callback);
  };

  var _hide = function () {
    clearTimeout(_handler);

    if (typeof _hideHandler === 'function') {
      _hideHandler.call(this);
    };
  };

  options.__propertys__ = function () {

    _showHandler = this.show;
    _hideHandler = this.hide;

    this.show = _show;
    this.hide = _hide;
  };

  options.initialize = function ($super, options) {
    this.addClass([_config.prefix + 'toast']);
    $super(options);
  };

  options.setContent = function (content) {
    this.create();
    this.contentDom.html(content);
  };

  var Toast = new cBase.Class(cUICore.Layer, options);
  return Toast;
});