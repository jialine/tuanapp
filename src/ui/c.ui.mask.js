define(['libs', 'cBase', 'cUIAbstractView'], function (libs, cBase, AbstractView) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
  };

  options.initialize = function ($super, opts) {
    this.bindEvent();
    this.addClass(_config.prefix + 'mask');
    $super(opts);
  };

  options.bindEvent = function () {
    this.addEvent('onCreate', function () {
      this.setRootStyle();
      this.onResize = $.proxy(function () {
        this.resize();
      }, this);

      this.onResize();
    });

    this.addEvent('onShow', function () {
      this.setzIndexTop(-1);
      $(window).bind('resize', this.onResize);

      this.root.bind('touchmove', function (e) {
        e.preventDefault();
      });

      this.onResize();
    });

    this.addEvent('onHide', function () {
      $(window).unbind('resize', this.onResize);
      this.root.unbind('touchmove');
    });

  };
  options.setRootStyle = function () {
    this.root.css({
      position: 'absolute',
      left: '0px',
      top: '0px'
    });
  };

  options.createHtml = function () {
    return '<div></div>';
  };

  options.resize = function () {
    var w = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

    this.root.css({
      width: '100%',
      height: h + 'px'
    });
  };

  return new cBase.Class(AbstractView, options);

});