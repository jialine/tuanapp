/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUIAbstractView
* @description 多数UI View的基类，提供基础方法，以及自建事件机制
*/
define(['libs', 'cBase', 'cUIBase'], function (libs, cBase, uiBase) {
  
  "use strict";

  /** 工具方法 */
  var _slice = Array.prototype.slice,
        _push = Array.prototype.push,
        _toString = Object.prototype.toString;

  /** 记录几大状态值 */
  var STATE_NOTCREATE = 'notCreate';
  var STATE_ONCREATE = 'onCreate';
  var STATE_ONSHOW = 'onShow';
  var STATE_ONHIDE = 'onHide';

  var options = {};

  /** 相关属性 */
  options.__propertys__ = function () {

    /** 允许设置的事件 */
    this.allowEvents = {
      onCreate: true,
      onShow: true,
      onHide: true
    };

    /** 允许设置的属性 */
    this.allowsPush = {
      classNames: true
    };

    /** 允许设置的基本配置 */
    this.allowsConfig = {
      rootBox: true
    };

    /** 存储的事件容器 */
    this.events = {
      onCreate: [],
      onShow: [],
      onHide: []
    };

    /** 当前状态 */
    this.status = STATE_NOTCREATE;

    /** 设置值时候执行的回调 */
    this.setOptionHander = [];

    /** 设置值时候执行的回调 */
    this.rootBox;

    /** 根节点唯一ID */
    this.id = uiBase.getCreateId();

    /** 默认class */
    this.classNames = [uiBase.config.prefix + 'view'];

    /** 根节点 */
    this.root;

    /** 是否已经创建dom标识 */
    this.isCreate = false;

  };

  /**
  * @method initialize
  * @param opts {object}        构造函数（实例化）传入的参数
  * @description 构造函数入口
  */
  options.initialize = function (opts) {
    this.setOption(function (k, v) {
      switch (true) {
        case this.allowEvents[k]:
          this.addEvent(k, v);
          break;
        case this.allowsPush[k]:
          _toString.call(v) === '[object Array]' ? _push.apply(this[k], v) : this[k].push(v);
          break;
        case this.allowsConfig[k]:
          this[k] = v;
          break;
      }
    });
    this.readOption(opts);
  };

  /**
  * @method readOption
  * @param opts {object}        构造函数（实例化）传入的参数
  * @description 读取构造函数（实例化）传入的参数，并遍历参数对象，并将键值对作为参数传递给setOptionHander集合中的函数执行
  */
  options.readOption = function (opts) {
    opts = opts || {};
    var scope = this;
    $.each(opts, function (k, v) {
      $.each(scope.setOptionHander, function (fk, fun) {
        if (typeof fun === 'function')
          fun.call(scope, k, v);
      });
    });
  };

  /**
  * @method setOption
  * @param fun {function}        回调函数
  * @description 传入回调函数给setOptionHander数组集合
  */
  options.setOption = function (fun) {
    this.setOptionHander.push(fun);
  };

  /**
  * @method createRoot
  * @description 构建根节点
  */
  options.createRoot = function () {
    var root = document.createElement('div');
    root.className = this.classNames.join(' ');
    root.id = this.id;
    return $(root);
  };

  /**
  * @method addClass
  * @param cls {String/array}        classname
  * @description 增加class
  */
  options.addClass = function (cls) {
    this.classNames.push(cls);
    if (!this.root) return;
    if (typeof cls == 'array') {
      for (var k in cls) {
        this.root.addClass(cls[k]);
      }
    } else if (typeof cls == 'string') {
      this.root.addClass(cls);
    }
  };

  /**
  * @method removeClass
  * @param cls {String/array}        classname
  * @description 移除class
  */
  options.removeClass = function (cls) {
    if (typeof cls == 'array') {
      for (var k in cls) {
        this.root.removeClass(cls[k]);
      }
    } else if (typeof cls == 'string') {
      this.root.removeClass(cls);
    }
  };

  /**
  * @method createHtml
  * @description 子类必须重写的方法，不重写会抛出一个错误
  */
  options.createHtml = function () {
    throw new Error('未定义createHtml方法');
  };

  /**
  * @method setRootHtml
  * @param html {String/dom}
  * @description 设置根节点html内容
  */
  options.setRootHtml = function (html) {
    this.root && (this.root.empty(), this.root.append(html));
  };

  /**
  * @method getRoot
  * @description 获取根节点
  */
  options.getRoot = function () {
    return this.root;
  };

  /**
  * @method addEventType
  * @param type {String}    事件点名称
  * @description 增加新的可监控事件点
  */
  options.addEventType = function (type) {
    this.allowEvents[type] = true;
    this.events[type] = [];
  };

  /**
  * @method addEvent
  * @param type {String}     事件名称
  * @param fun {function}    回调函数
  * @description 为各个事件点添加需要回调的函数
  */
  options.addEvent = function (type, fun) {
    if (!this.allowEvents[type])
      return false;
    this.events[type] && this.events[type].push(fun);
  };

  /**
  * @method removeEvent
  * @param type {String}     事件名称
  * @param fun {function}    回调函数
  * @description 移除各个事件点添加需要回调的函数
  */
  options.removeEvent = function (type, fun) {
    if (this.events[type]) {
      if (fun) {
        deleleValue(fun, this.events[type]);
      } else {
        this.events[type] = [];
      }
    }
  };

  /**
  * @method remove
  * @description 移除节点
  */
  options.remove = function () {
    this.hide();
    this.root.remove();
  };

  /**
  * @method trigger
  * @param type {String}     事件名称
  * @param args {object}     传入的参数
  * @description 触发事件
  */
  options.trigger = function (type, args) {
    var results = [], i;
    if (this.events[type]) {
      args = args || [];
      for (i = 0; i < this.events[type].length; i++) {
        results[results.length] = this.events[type][i].apply(this, args);
      }
    }
    return results;
  };

  /**
  * @method trigger
  * @param type {String}     事件名称
  * @param args {object}     传入的参数
  * @description 触发事件
  */
  options.create = function () {
    if (!this.isCreate && this.status !== STATE_ONCREATE) {
      this.rootBox = this.rootBox || $('body');
      this.root = this.createRoot();
      this.root.hide();
      this.rootBox.append(this.root);
      this.root.append(this.createHtml());
      //this.root.html();
      this.trigger('onCreate');
      this.status = STATE_ONCREATE;
      this.isCreate = true;
    }
  };

  /**
  * @method template
  * @param html {String}     模板html
  * @description 调用模板函数解析字符串（现在使用underscore方法）
  */
  options.template = function (html) {
    return _.template(html);
  };

  /**
  * @method showAction
  * @param callback {function}     回调函数
  * @description 显示时执行的方法
  */
  options.showAction = function (callback) {
    this.root.show();
    typeof callback == 'function' && callback();
  };

  /**
  * @method hideAction
  * @param callback {function}     回调函数
  * @description 隐藏时执行函数
  */
  options.hideAction = function (callback) {
    this.root.hide();
    typeof callback == 'function' && callback();
  };

  /**
  * @method setzIndexTop
  * @param offset {int}
  * @description 设置z-index的值为最大
  */
  options.setzIndexTop = function (offset) {
    offset = typeof offset !== 'number' ? 0 : offset;
    this.root.css('z-index', uiBase.getBiggerzIndex() + offset);
  };

  /**
  * @method isNotCreate
  * @description 判断是否未创建根节点
  */
  options.isNotCreate = function () {
    return this.status === STATE_NOTCREATE;
  };

  /**
  * @method isShow
  * @description 判断是否显示
  */
  options.isShow = function () {
    return this.status === STATE_ONSHOW;
  };

  /**
  * @method isHide
  * @description 判断是否隐藏
  */
  options.isHide = function () {
    return this.status === STATE_ONHIDE;
  };

  /**
  * @method show
  * @param callback {function}
  * @description 显示时候的回调
  */
  options.show = function (callback) {
    if (this.status === STATE_ONSHOW)
      return;
    this.create();
    this.showAction($.proxy(function () {
      this.trigger('onShow');
      this.status = STATE_ONSHOW;
      callback && callback.call(this);
    }, this));
  };

  /**
  * @method hide
  * @param callback {function}
  * @description 隐藏时候的回调
  */
  options.hide = function (callback) {
    if (!this.root || this.status === STATE_ONHIDE) return;
    this.hideAction($.proxy(function () {
      this.trigger('onHide');
      this.status = STATE_ONHIDE;
      callback && callback.call(this);
    }, this));
  };

  /**
  * @method reposition
  * @description 重置root位置让其居中显示（多用于弹出层类）
  */
  options.reposition = function () {
    this.root.css({
      'margin-left': -($(this.root).width() / 2) + 'px',
      'margin-top': -($(this.root).height() / 2) + 'px'
    });
  };

  return new cBase.Class(options);

});