﻿define(['libs', 'cBase', 'cUIPageview', 'cUIMask'], function (libs, cBase, PageView, Mask) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  var _calback = function () { };

  var _attributes = {};
  _attributes.class = _config.prefix + 'warning';

  _attributes.onCreate = function () {
    this.root.html([
          '<div class="head-warning">',
              '<div class="head-warning-padding">',
                  '<div class="head-warning-content">',
                      '<div class="cui-load-fail cui-text-center">',
                        '<div class="cui-load-error">',
                              '<div class="i cui-wifi i_bef cui-fail-icon">',
                              '</div>',
                        '</div>',
                        '<p class="cui-grayc">加载失败，请稍后再试试吧</p>',
                        '<span class="cui-btns-retry">重试</span>',
                        '<div class="cui-glines"></div>',
                        '<p class="cui-grayc">或者拨打携程客服电话</p>',
                        '<div id="telBtn"><span class="cui-btns-tel"><i class="icon_phone i_bef"></i>联系客服</span></div>',
                    '</div>',
                  '</div>',
              '</div>',
          '</div>'
                    ].join(''));
    this.addClass('head-warning-top');
    this.retryDom = this.root.find('.cui-btns-retry');

    this.retryDom.bind('click', $.proxy(function () {
      this.callback && this.callback();
    }, this));
  };

  _attributes.onShow = function () {
    this.setzIndexTop();
    window.scrollTo(0, 0);
    this.root.find('#telBtn').click(function () {
      Guider.apply({
        hybridCallback: function () {
          Guider.callService();
        },
        callback: function () {
          window.location.href = 'tel:4000086666';
        }
      });
    });
  };

  options.__propertys__ = function () {
    this.retryDom;
    this.callback = function () { };
  };

  options.initialize = function ($super, opts) {
    $super(_attributes, opts);
  };
  options.retryClick = function (callback) {
    if (callback) {
      this.callback = callback;
    }
  }
  return new cBase.Class(PageView, options);

});