define(['libs', 'cBase', 'cUIAbstractView'], function (libs, cBase, AbstractView) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
  };

  options.initialize = function ($super, opts) {
    var allowOptions = {};
    this.setOption(function (k, v) {
    });
    this.addClass(_config.prefix + 'pageview');
    $super(opts);
  };

  options.createHtml = function () {
    return '';
  };

  return new cBase.Class(AbstractView, options);

});