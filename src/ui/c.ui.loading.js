define(['libs', 'cBase', 'Layer', 'Mask'], function (libs, cBase, Layer, Mask) {

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
  _attributes.onHide = function () {
    this.mask.root.remove();
  };

  options.__propertys__ = function () {
    this.contentDom;
    this.loadHtml = '';
    this.mask = new Mask({
      classNames: [_config.prefix + 'opacitymask']
    });
  };

  options.initialize = function ($super) {

    $super(_attributes);
  };

  options.setHtml = function (loadHtml) {
    this.loadHtml = loadHtml;
  };

  return new cBase.Class(Layer, options);

});