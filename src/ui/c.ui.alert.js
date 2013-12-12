define(['libs', 'cBase', 'cUILayer'], function (libs, cBase, Layer) {
  var _toString = Object.prototype.toString;
  var STYLE_CONFIRM = 'confirm';
  var STYLE_CANCEL = 'cancel';

  var _attributes = {};
  _attributes.onCreate = function () {
    this.loadButtons();
  };

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
    this.tpl = this.template([
        '<div class="cui-pop-box">',
          '<div class="cui-bd">',
            '<p class="cui-error-tips"><%=message%></p>',
            '<div class="cui-roller-btns">',
            '</div>',
          '</div>',
        '</div>'
    ].join(''));
    this.title = '';
    this.message = '';
    this.buttons = [{
      text: '确定',
      type: 'confirm',
      click: function () {
        this.hide();
      }
    }];

    this.viewdata = {
      title: '',
      message: ''
    };
  };

  options.initialize = function ($super, opts) {
    var allowOptions = {
      title: true,
      message: true,
      buttons: true
    };
    this.setOption(function (k, v) {
      switch (true) {
        case allowOptions[k]:
          this[k] = v;
          break;
      }
    });
    this.addClass(_config.prefix + 'alert');
    $super($.extend(_attributes, opts));
    this.buildViewData();
  };

  options.buildViewData = function () {
    this.viewdata.title = this.title;
    this.viewdata.message = this.message;
  };
  options.setViewData = function (data) {
    data.title && (this.title = data.title);
    data.message && (this.message = data.message);
    data.buttons && (this.buttons = data.buttons);
    this.buildViewData();
    this.setRootHtml(this.createHtml());
    this.loadButtons();
  };
  options.loadButtons = function () {
    if (!this.root) this.create();
    var btnBox = this.root.find('.cui-roller-btns');
    var btus = this.createButtons();
    btnBox.empty();
    $.each(btus, function (k, v) {
      btnBox.append(v);
    });
  };
  options.createButtons = function () {
    var btns = [], isarr = _toString.call(this.buttons) === '[object Array]', i = 0;
    var scope = this;
    $.each(this.buttons, function (k, v) {
      var text = '', cls = [], click = function () { };
      if (isarr) {
        text = v.text;
        v.cls && cls.push(v.cls);
        v.type = v.type ? v.type : (text == '取消' ? STYLE_CANCEL : STYLE_CONFIRM);
        switch (v.type) {
          case STYLE_CANCEL:
            cls.push('cui-btns-cancel');
            break;
          case STYLE_CONFIRM:
            cls.push('cui-btns-sure');
            break;
        };
        v.click && (click = v.click);
      } else {
        text = k;
        typeof v === 'function' && (click = v);
      }
      btns[i] = $('<div class="cui-flexbd ' + cls.join(' ') + '">' + text + '</div>');
      btns[i].addClass(cls.join(' '));
      btns[i].bind('click', $.proxy(click, scope));
      i++;
    });
    return btns;
  };
  options.createHtml = function () {
    return this.tpl(this.viewdata);
  };

  return new cBase.Class(Layer, options);

});