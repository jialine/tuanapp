/**
* @author l_wang王磊 <l_wang@Ctrip.com>
* @class cUIAlter
* @description 提供alter类弹出框
*/
define(['libs', 'cBase', 'cUILayer'], function (libs, cBase, Layer) {
  "use strict";

  var _toString = Object.prototype.toString;

  /** 当前alert的状态值 */
  var STYLE_CONFIRM = 'confirm';
  var STYLE_CANCEL = 'cancel';

  /** 用于继承的属性对象，后面会逐步填充 */
  var _attributes = {};

  _attributes.onCreate = function () {
    this.loadButtons();
  };

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
    
    /** 用于alert的模板方法 */
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

    /** 默认的按钮 */
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
    /** 新增可用于设置的属性 */
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

    /** 调用父构造函数 */
    $super($.extend(_attributes, opts));
    this.buildViewData();
  };

  /**
  * @method buildViewData
  * @description 设置标题和内容文字
  */
  options.buildViewData = function () {
    this.viewdata.title = this.title;
    this.viewdata.message = this.message;
  };

  /**
  * @method setViewData
  * @param {object} data 用于设置属性的对象
  * @description 根据值设置对象，然后调用buildViewData
  */
  options.setViewData = function (data) {
    data.title && (this.title = data.title);
    data.message && (this.message = data.message);
    data.buttons && (this.buttons = data.buttons);
    this.buildViewData();
    this.setRootHtml(this.createHtml());
    this.loadButtons();
  };

  /**
  * @method loadButtons
  * @description 根据配置生成按钮
  */
  options.loadButtons = function () {
    if (!this.root) this.create();
    var btnBox = this.root.find('.cui-roller-btns');
    var btus = this.createButtons();
    btnBox.empty();
    $.each(btus, function (k, v) {
      btnBox.append(v);
    });
  };

  /**
  * @method createButtons
  * @description 按钮具体生成函数
  */
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

  /**
  * @method createHtml
  * @description 生成root dom 结构
  */
  options.createHtml = function () {
    return this.tpl(this.viewdata);
  };

  var Alert = new cBase.Class(Layer, options);
  Alert.STYLE_CONFIRM = STYLE_CONFIRM;
  Alert.STYLE_CANCEL = STYLE_CANCEL;
  return Alert;

});