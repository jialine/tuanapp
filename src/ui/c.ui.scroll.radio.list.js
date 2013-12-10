
/**
* 
* by l_wang
*/

define(['libs', 'cBase', 'cUICore', 'cUIScrollList'], function (libs, cBase, cUICore, ScrollList) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  /**
  * 获得元素占位的高宽
  */
  var _getElementRealSize = function (el) {
    return {
      width: el.width(),
      height: el.height()
    };
  };

  var _reposition = function (el) {
    var size = _getElementRealSize(el);
    el.css({
      'margin-left': -(size.width / 2) + 'px',
      'margin-top': (-(size.height / 2) + $(window).scrollTop()) + 'px',
      left: '50%',
      top: '50%'
    });
  };

  var _attributes = {};
  _attributes.class = _config.prefix + 'warning';

  _attributes.onCreate = function () {
    this.root.html([
                        '<div class="cui-pop-box" lazyTap="true">',
                             '<div class="cui-hd"><div class="cui-text-center">' + this.title + '</div></div>',
                             '<div class="cui-bd">',
                             '</div>',
                        '</div>'
                    ].join(''));
    this.root.css({
      position: 'absolute'
    });
    this.title = this.root.find('.cui-text-center');
    this.content = this.root.find('.cui-bd');
  };
  _attributes.onShow = function () {
    var scope = this;
    this.mask.show();
    scope.mask.root.on('click', function () {
      scope.hide();
      scope.mask.root.off('click');
    });
    this.scroll = new ScrollList({
      wrapper: this.content,
      data: this.data,
      index: this.index,
      key: this.key,
      disItemNum: this.disItemNum,
      changed: function (item) {
        scope.hide(); //改变则隐藏该层
        scope.itemClick.call(scope, item); //改变则触发事件
      }
    });

    this.scroll.setKey(this.key);
    this.setzIndexTop();
    _reposition(this.root);
  };
  _attributes.onHide = function () {
    this.mask.hide();
    this.mask.root.remove();
    this.scroll.removeEvent();
    this.root.remove();
  };

  options.__propertys__ = function () {
    this.title;
    this.content;
    this.itemClick = function () { };
    this.mask = new cUICore.Mask({ classNames: [_config.prefix + 'opacitymask'] });
    this.scroll = null;
    this.data = []; //用于组装list的数据
    this.index = -1; //当前索引值
    this.key = null;
    this.disItemNum = 5;
  };

  options.initialize = function ($super, opts) {
    this.setOption(function (k, v) {
      this[k] = v;
    });
    $super($.extend(_attributes, opts));
  };

  var ScrollRadioList = new cBase.Class(cUICore.PageView, options);
  return ScrollRadioList;

});