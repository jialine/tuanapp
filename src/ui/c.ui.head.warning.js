/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUIHeadWarning
* @description 带header的alert层
*/
define(['libs', 'cBase', 'cUIPageview'], function (libs, cBase, PageView) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

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

    this.addClass('head-warning-top');
    this.warningtitleDom = this.root.find('.head-warning-header-title');
    this.warningcontentDom = this.root.find('.head-warning-content-title');
    this.warningleftbtuDom = this.root.find('.head-warning-header-backbtu');

    this.warningleftbtuDom.bind('click', $.proxy(function () {
      this.callback && this.callback();
    }, this));
  };

  _attributes.onShow = function () {
    this.setzIndexTop();
    window.scrollTo(0, 0);
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
    $super($.extend(_attributes, opts));
  };

  /**
  * @method setTitle
  * @param title {String}       标题
  * @param content {String}     内容
  * @param callback {function}  回调函数
  * @description 设置标题，并且重写回调
  */
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

  return new cBase.Class(PageView, options);

});