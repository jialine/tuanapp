define(['libs', 'cBase', 'cUIMask'], function (libs, cBase, Mask) {

  var STYLE_CONFIRM = 'confirm';
  var STYLE_CANCEL = 'cancel';

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  var opacityMask = new Mask({ classNames: [_config.prefix + 'opacitymask'] });


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
    // this.hashObserve = new cUICore.HashObserve({
    //   hash: this.id,
    //   scope: this,
    //   callback: function () {
    //     this.hide();
    //   }
    // });
    this.viewdata = {
      title: '',
      message: ''
    };
    this.autoPositionHander = $.proxy(function () {
      this.reposition();
    }, this);
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
    this.buildEvent();
    $super(opts);
    this.buildViewData();
  };

  options.buildEvent = function () {
    this.addEvent('onCreate', function () {
      this.loadButtons();
    });
    this.addEvent('onShow', function () {
      this.reposition();
      opacityMask.show(); //111
      this.setzIndexTop();
      this.hashObserve.start();
      this.autoposition();
    });
    this.addEvent('onHide', function () {
      opacityMask.hide(); //111
      setTimeout(bindthis(function () {
        this.hashObserve.end();
      }, this), 10);
      this.unautoposition();
    });
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
      // btus[i] = $('<input type="button" value="' + text + '">');
      btns[i] = $('<div class="cui-flexbd ' + cls.join(' ') + '">' + text + '</div>');
      btns[i].addClass(cls.join(' '));
      btns[i].bind('click', bindthis(click, this));
      i++;
    });
    return btns;
  };
  options.createHtml = function () {
    return this.tpl(this.viewdata);
  };
  options.autoposition = function () {
    $(window).bind('resize', this.autoPositionHander);
  };
  options.unautoposition = function () {
    $(window).unbind('resize', this.autoPositionHander);
  };

  return new cBase.Class(cUICore.AbstractView, options);

});