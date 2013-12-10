// @author l_wang
// @email l_wang@ctrip.com

define(['libs', 'cBase', 'cUICore'], function (libs, cBase, cUICore) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  var _attributes = {};

  _attributes.class = _config.prefix + 'loading';

  _attributes.onCreate = function () { };

  var dom = '<div class="cui-breaking-load"><div class="cui-w-loading"></div><i class="cui-white-logo"></i></div>';
  _attributes.onShow = function () {
    this.contentDom.html(dom);
    this.reposition();
  };

  options.__propertys__ = function () { };

  options.initialize = function ($super) {
    $super(_attributes);
  };

  return new cBase.Class(cUICore.Layer, options);

});