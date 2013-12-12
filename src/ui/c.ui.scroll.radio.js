// @author l_wang

define(['libs', 'cBase', 'cUILayer', 'cUIScrollList'], function (libs, cBase, Layer,  ScrollList) {

  var options = {};

  var _config = { prefix: 'cui-' };

  var _attributes = {};
  _attributes.class = _config.prefix + 'warning';

  _attributes.onCreate = function () {

    //refactor -- use tempalte to replace
    this.root.html([
      '<div class="cui-pop-box" >',
        '<div class="cui-hd">',
          '<div class="cui-text-center">',
          '' + this.title + '</div>',
        '</div>',
        '<div class="cui-bd ">',
          '<div class="cui-roller scrollWrapper">',
          '</div>',
          '<p class="cui-roller-tips">',
            '' + this.tips + '</p>',
          '<div class="cui-roller-btns">',
            '<div class="cui-btns-cancel cui-flexbd">' + this.cancel + '</div> <div class="cui-btns-sure cui-flexbd" >',
            '' + this.ok + '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join(''));

    this.title = this.root.find('.cui-text-center');
    this.tips = this.root.find('.cui-roller-tips');
    this.btCancel = this.root.find('.cui-btns-cancel');
    this.btOk = this.root.find('.cui-btns-sure');
    this.line = $('<div class="cui-mask-gray"></div><div class="cui-lines">&nbsp;</div>');
    this.wrapper = this.root.find('.scrollWrapper');
  };

  _attributes.onShow = function () {
    var scope = this;
    //没有data的话便不进行渲染了
    if (!this.data || this.data.length == 0) return false;

    for (var i = 0, len = this.data.length; i < len; i++) {
      var param = {
        wrapper: this.wrapper,
        data: this.data[i],
        type: 'radio',
        disItemNum: this.disItemNum,

        changed: (function (i) {
          return function (item) {
            var changed = scope.changed[i];
            if (typeof changed == 'function') {
              changed.call(scope, item); //改变则触发事件
            }
          }
        })(i)
      }
      if (i == 0 && len == 3) {
        param.className = 'cui-roller-bd  cui-flex2'
      }
      var s = new ScrollList(param);
      this.scroll.push(s);
    }

    for (var i = 0, len = this.data.length; i < len; i++) {
      this.scroll[i].setIndex(this.index[i]);
      this.scroll[i].setKey(this.key[i]);
    }

    this.wrapper.append(this.line);
    this.btOk.on('click', function () {
      var item = [];
      for (var i = 0, len = scope.scroll.length; i < len; i++) {
        item.push(scope.scroll[i].getSelected());
      }
      scope.okClick.call(scope, item); //改变则触发事件
      scope.hide();
    });

    this.btCancel.on('click', function () {
      var item = [];
      for (var i = 0, len = scope.scroll.length; i < len; i++) {
        item.push(scope.scroll[i].getSelected());
      }
      scope.cancelClick.call(scope, item); //改变则触发事件
      scope.hide();
    });
    this.setzIndexTop();
  };

  _attributes.onHide = function () {
    for (var i = 0, len = this.scroll.length; i < len; i++) {
      this.scroll[i].removeEvent();
    }
    this.btOk.off('click');
    this.btCancel.off('click');
    this.root.remove();
  };

  options.__propertys__ = function () {
    var scope = this;
    this.changed = [];
    this.scroll = [];
    this.data = [];
    this.index = [];
    this.key = [];
    this.disItemNum = 5;

    this.tips = '';
    this.btCancel;
    this.btOk;
    this.cancel = '取消';
    this.ok = '确定';
    this.cancelClick = function () { scope.hide() };
    this.okClick = function () { scope.hide() };
  };

  options.initialize = function ($super, opts) {
    this.setOption(function (k, v) {
      this[k] = v;
    });
    $super($.extend(_attributes, opts));
  };

  options.setTips = function (str) {
    this.tips.html(str);
  };

  var ScrollRadio = new cBase.Class(Layer, options);
  return ScrollRadio;

});