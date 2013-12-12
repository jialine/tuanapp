define(['libs', 'cBase', 'cUILayer'], function (libs, cBase, Layer) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  var _attributes = {};

  _attributes['class'] = _config.prefix + 'loading';

  _attributes.onCreate = function () { };

  _attributes.onShow = function () {
    this.contentDom.html('<div class="cui-breaking-load"><div class="cui-w-loading"></div><i class="cui-white-logo"></i></div>');
    this.reposition();
  };

  options.__propertys__ = function () {
    this.contentDom;
    this.loadHtml = '';
  };

  options.initialize = function ($super) {

    $super(_attributes);
  };

  options.setHtml = function (html) {
    this.loadHtml = html;
  };

  return new cBase.Class(Layer, options);

});