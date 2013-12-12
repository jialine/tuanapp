define(['libs', 'cBase', 'cUIAbstractView'], function (libs, cBase, AbstractView) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
    this.mask = new Mask({
      classNames: [_config.prefix + 'warning-mask']
    });
  };

  options.initialize = function ($super, opts) {
    this.addClass(_config.prefix + 'pageview');

    this.addEvent('onCreate', function () {
      this.mask.create();
      this.mask.root.css({
        background: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAPX19QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==) repeat'
      });
      this.root.css({
        position: 'absolute',
        left: '0px',
        top: '0px'
      });
    });

    this.addEvent('onShow', function () {
      this.mask.show();
      this.mask.root.css({
        'z-index': '500'
      });
    });

    this.addEvent('onHide', function () {
      this.mask.hide();
    });

    $super($.extend(_attributes, opts));
  };

  options.createHtml = function () {
    return '';
  };

  return new cBase.Class(AbstractView, options);

});