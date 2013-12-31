define(['libs', 'cBase', 'cUIAbstractView', 'cUIMask'], function (libs, cBase, AbstractView, Mask) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  //  var _mask = new Mask({
  //    classNames: [_config.prefix + 'opacitymask']
  //  });

  options.__propertys__ = function () {
    this.tpl = this.template([
                '<div class="' + _config.prefix + 'layer-padding">',
                '<div class="' + _config.prefix + 'layer-content"><%=content%></div>',
                '</div>'
            ].join(''));
    this.content = '';
    this.contentDom;
    this.mask = new Mask({
      classNames: [_config.prefix + 'opacitymask']
    });
    this.addClass(_config.prefix + 'layer');
    this.viewdata = {};
    this.windowResizeHander;
    this.setIntervalResource;
    this.setIntervalTotal = 0;
  };

  options.initialize = function ($super, opts) {
    var allowConfig = {
      content: true
    };
    this.setOption(function (k, v) {
      switch (true) {
        case allowConfig[k]:
          this[k] = v;
          break;
        case 'class' === k:
          this.addClass(v);
          break;
      }
    });

    this.bindEvent();
    $super(opts);
    this.loadViewData();
  };

  options.loadViewData = function () {
    this.viewdata.content = this.content;
  };

  options.setViewData = function (data) {
    this.viewdata = cUtility.mix(this.viewdata, data);
    this.setRootHtml(this.createHtml());
  };

  options.bindEvent = function () {
    this.addEvent('onCreate', function () {
      this.windowResizeHander = $.proxy(this.reposition, this);
      this.contentDom = this.root.find('.' + _config.prefix + 'layer-content');
    });
    this.addEvent('onShow', function () {
      this.mask.show();
      $(window).bind('resize', this.windowResizeHander);
      this.root.css('visibility', 'hidden');
      this.reposition();
      //显示以后，连续计算位置
      this.setIntervalResource = setInterval($.proxy(function () {
        if (this.setIntervalTotal < 10) {
          this.windowResizeHander();
        } else {
          this.setIntervalTotal = 0;
          this.root.css('visibility', 'visible');
          clearInterval(this.setIntervalResource);
        }
        this.setIntervalTotal++;
      }, this), 1);
      this.setzIndexTop();
    });
    this.addEvent('onHide', function () {
      $(window).unbind('resize', this.windowResizeHander);
      clearInterval(this.setIntervalResource);
      this.root.css('visibility', 'visible');
      this.mask.hide();

    });
  };

  options.createHtml = function () {
    return this.tpl(this.viewdata);
  };

  options.maskToHide = function (fn) {

    this.mask.root.on('click', $.proxy(function () {
      this.hide();
      typeof fn == 'function' && fn();
      this.mask.root.off('click');
    }, this));
    this.mask.addEvent('onHide', function () {
      this.root.off('click');
      this.root.remove();
    });

  };

  return new cBase.Class(AbstractView, options);
});