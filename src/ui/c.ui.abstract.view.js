define(['libs', 'cBase', 'cUIBase'], function (libs, cBase, uiBase) {

  var _slice = Array.prototype.slice,
        _push = Array.prototype.push,
        _toString = Object.prototype.toString;

  var STATE_NOTCREATE = 'notCreate';
  var STATE_ONCREATE = 'onCreate';
  var STATE_ONSHOW = 'onShow';
  var STATE_ONHIDE = 'onHide';

  var options = {};

  options.__propertys__ = function () {
    //允许设置的事件
    this.allowEvents = {
      onCreate: true,
      onShow: true,
      onHide: true
    };
    this.allowsPush = {
      classNames: true
    };
    this.allowsConfig = {
      rootBox: true
    };
    this.events = {
      onCreate: [],
      onShow: [],
      onHide: []
    };
    this.status = STATE_NOTCREATE;
    this.setOptionHander = [];
    this.rootBox;
    this.id = uiBase.getCreateId();
    this.classNames = [uiBase.config.prefix + 'view'];
    this.root;
    this.isCreate = false;
  };

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

  options.setOption = function (fun) {
    this.setOptionHander.push(fun);
  };

  options.createRoot = function () {
    var root = document.createElement('div');
    root.className = this.classNames.join(' ');
    root.id = this.id;
    return $(root);
  };

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

  options.removeClass = function (cls) {
    if (typeof cls == 'array') {
      for (var k in cls) {
        this.root.removeClass(cls[k]);
      }
    } else if (typeof cls == 'string') {
      this.root.removeClass(cls);
    }
  };

  options.createHtml = function () {
    throw new Error('未定义createHtml方法');
  };

  options.setRootHtml = function (html) {
    this.root && (this.root.empty(), this.root.append(html));
  };

  options.getRoot = function () {
    return this.root;
  };

  options.addEventType = function (type) {
    this.allowEvents[type] = true;
    this.events[type] = [];
  };

  options.addEvent = function (type, fun) {
    if (!this.allowEvents[type])
      return false;
    this.events[type] && this.events[type].push(fun);
  };

  options.removeEvent = function (type, fun) {
    if (this.events[type]) {
      if (fun) {
        deleleValue(fun, this.events[type]);
      } else {
        this.events[type] = [];
      }
    }
  };

  options.remove = function () {
    this.hide();
    this.root.remove();
  };

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

  options.template = function (html) {
    return _.template(html);
  };

  options.showAction = function (callback) {
    this.root.show();
    typeof callback == 'function' && callback();
  };

  options.hideAction = function (callback) {
    this.root.hide();
    typeof callback == 'function' && callback();
  };

  options.setzIndexTop = function (offset) {
    offset = typeof offset !== 'number' ? 0 : offset;
    this.root.css('z-index', uiBase.getBiggerzIndex() + offset);
  };

  options.isNotCreate = function () {
    return this.status === STATE_NOTCREATE;
  };

  options.isShow = function () {
    return this.status === STATE_ONSHOW;
  };

  options.isHide = function () {
    return this.status === STATE_ONHIDE;
  };

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

  options.hide = function (callback) {
    if (!this.root || this.status === STATE_ONHIDE) return;
    this.hideAction($.proxy(function () {
      this.trigger('onHide');
      this.status = STATE_ONHIDE;
      callback && callback.call(this);
    }, this));
  };
  options.reposition = function () {
    this.root.css({
      'margin-left': -($(this.root).width() / 2) + 'px',
      'margin-top': -($(this.root).height() / 2) + 'px'
    });
  };

  return new cBase.Class(options);

});