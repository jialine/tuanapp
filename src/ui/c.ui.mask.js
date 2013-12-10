define(['libs', 'cBase', 'cUICore'], function (libs, cBase, cUICore) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {};

  options.initialize = function ($super, opts) {
    this.bindEvent();
    this.addClass(_config.prefix + 'mask');
    $super(opts);
  };

  options.bindEvent = function () {
    var patterns = {
      'onCreate': function () {
        this.setRootStyle();
        this.onResize = $.proxy(function () {
          this.resize();
        }, this);

        this.onResize();
      },

      'onShow': function () {
        this.setzIndexTop(-1);
        $(window).bind('resize', this.onResize);
        this.onResize();
      },

      'onHide': function(){
        $(window).unbind('resize', this.onResize);
      }
    }

    var scope = this;
    $.each(patterns, function(key, value){
      scope.addEvent(key, value);
    });


    // this.addEvent('onCreate', function () {
    //   this.setRootStyle();
    //   this.onResize = $.proxy(function () {
    //     this.resize();
    //   }, this);

    //   this.onResize();
    // });

    // this.addEvent('onShow', function () {
    //   this.setzIndexTop(-1);
    //   $(window).bind('resize', this.onResize);
    //   this.onResize();
    // });

    // this.addEvent('onHide', function () {
    //   $(window).unbind('resize', this.onResize);
    // });

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
    this.root.css({
      width: 'auto',
      height: 'auto',
      width: $(window).width() + 'px',
      height: $(window).height() + 'px'
    });
  };

  return new cBase.Class(cUICore.AbstractView, options);

});