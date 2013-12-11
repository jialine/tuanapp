define(['libs', 'cBase', 'cUICore'], function (libs, cBase, cUICore) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  _mask = new cUICore.Mask({
    classNames: [_config.prefix + 'warning-mask']
  });

  var _attributes = {};
  _attributes.class = _config.prefix + 'warning';
  _attributes.onCreate = function () {

    //l_wang 此处需要使用模板
    this.root.html([
                        '<div class="head-warning">',
                        '<div class="head-warning-padding">',
                        '<div class="head-warning-header">',
                        '<div class="head-warning-header-backbtu"><span class="returnico"></span></div>',
                        '<div class="head-warning-header-title"></div>',
                        '</div>',
                        '<div class="head-warning-content">',
                        '<div class="head-warning-content-icon"><div class="cui-load-error"><div class="i cui-wifi cui-exclam"></div></div></div>',
                        '<div class="head-warning-content-title"></div>',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(''));
    this.root.css({
      position: 'absolute',
      left: '0px',
      top: '0px'
    });
    this.addClass('head-warning-top');
    this.warningtitleDom = this.root.find('.head-warning-header-title');
    this.warningcontentDom = this.root.find('.head-warning-content-title');
    this.warningleftbtuDom = this.root.find('.head-warning-header-backbtu');

    _mask.create();
    _mask.root.css({
      background: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAPX19QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==) repeat'
    });
    this.warningleftbtuDom.bind('click', $.proxy(function () {
      this.callback && this.callback();
    }, this));
  };
  _attributes.onShow = function () {
    _mask.show();
    this.setzIndexTop();
    window.scrollTo(0, 0);
  };
  _attributes.onHide = function () {
    _mask.hide();
  };

  options.__propertys__ = function () {
    this.warningtitleDom;
    this.warningcontentDom;
    this.warningtitle = '';
    this.warningcontent = '';
    this.callback = function () {
    };
  };

  options.initialize = function ($super, opts) {

    this.setOption(function (k, v) {
      switch (k) {
        case 'title':
          this.warningtitle = v;
          break;
        case 'content':
          this.warningcontent = v;
          break;
        case 'callback':
          this.callback = v;
          break;
      }
    });

    $super($.extend(_attributes, opts));
  };

  options.setTitle = function (title, content, callback) {
    if (title) {
      this.create();
      this.warningtitleDom.html(title);
      this.warningcontentDom.html(content);
    }
    if (callback) {
      this.callback = callback;
    }
  };

  return new cBase.Class(cUICore.PageView, options);

});