﻿define(['libs', 'cBase', 'cUICore'], function (libs, cBase, cUICore) {

  var _attributes = {};
  _attributes['class'] = _config.prefix + 'loading';
  _attributes.onShow = function () {
    this.contentDom.html([
                     '<div class="cui-grayload-text">',
                         '<div class="cui-w-loading"></div>',
                         '<i class="cui-white-logo"></i>',
                         '<i class="cui-grayload-close"></i>',
                         '<div class="cui-grayload-bfont">' + this.text + '</div>',
                    '</div>'
                    ].join(''));
    this.root.find('.cui-grayload-close').off('click').on('click', $.proxy(function () {
      this.callback && this.callback();
      this.hide();
    }, this));
    this.reposition();
  };

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
    this.contentDom;
    this.callback = function () { };
    this.text = '发送中...';
  };

  options.initialize = function ($super, opts) {
    this.callback = callback || function () { };
    this.text = text || '发送中...';
    $super(_attributes);
  };

  options.createHtml = function () {
    return '';
  };

  return new cBase.Class(cUICore.Layer, options);

});