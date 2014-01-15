// @author Michael.Lee/Yexiaochai/Hanqing.Shen
// @email cmli@ctrip.com

define(
  ['libs', 'cUIAlert', 'cUIWarning', 'cUIHeadWarning', 'cUIWarning404', 'cUIToast', 'cStorage', 'cBase', 'cUtility', 'cAdView', 'cUILoading'],
  function (libs, Alert, Warning, HeadWarning, Warning404, Toast, cStorage, cBase, cUtility, cAdView, Loading) {

  function debughander(e, on, line) {
    if (e && e.originalEvent) alert(e.originalEvent.message + ' ' + on + ' ' + line);
  };

  var localStorage = cStorage.localStorage;

  // @description 用于切换页面时，让当前input失去焦点
  document.body && (document.body.tabIndex = 10000);

  var View = {};

  View.ENUM_STATE_NOCREATE = 0;
  View.ENUM_STATE_CREATE = 1;
  View.ENUM_STATE_LOAD = 2;
  View.ENUM_STATE_SHOW = 3;
  View.ENUM_STATE_HIDE = 4;

  // @description 子类可以设置此pageid，用于autotest
  View.pageid = 0;

  // @description 视图的scroll位置
  View.scrollPos = { x: 0, y:0 };

  // @description 初始化页头和页尾
  View.header = null;
  View.footer = null;

  // @description 初始化控件
  View.warning = null;
  View.alert = null;

  View.onCreate = function(){};

  View.viewInitialize = function(){};

  // @param request {String}
  // @param application {Object}
  // @param viewname {String}
  View.initialize = function(request, appliction, viewname){

    // @description 初始化
    this.viewdata = {};
    this.appliction = appliction;
    this.request = request;
    this.viewname = viewname;

    // @description 初始化view状态
    this.state = this.ENUM_STATE_CREATE;

    this.$el.addClass('sub-viewport');

    // @description 为每个view创建一个唯一的id
    this.id = _.uniqueId('viewport');
    this.$el.attr('id', 'id_' + this.id);

    // @description添加自定义pageid
    if (this.pageid)
      this.$el.attr('page-id', this.pageid);

    this.$el.attr('page-url', this.request.viewpath);

    // @description 初始化控件
    this.warning = new Warning({ title: '' });
    this.headwarning = new HeadWarning({ title: '' });
    this.warning404 = new Warning404();
    this.loading = new Loading();
    this.toast = new Toast();

    var callback = function () { this.hide(); };
    this.alert = new Alert({ title: '提示信息', message: '', buttons: [{ text: '知道了', click: callback }]});

    // @description 加入页面自定义的css
    if (_.isArray(this.css)) {
      this.appendCss(this.css);
    }

    // @description 初始化底部下载广告
    if (cAdView) this.footer = cAdView.getInstance();

    this.debug();

    // @description 进入生命周期onCreate
    this.onCreate();
  };

  View.turning = function () {
    this.appliction.turning();
  };

  // **************************************************************************
  // @deprecated
  View._initializeHeader = function(){
    var self = this;
    if (this.header.backUrl) {
      this.$el.on('click', '#js_return', function () {
        self.back(self.header.backUrl);
      });
    }
    if (this.header.home) {
      this.$el.delegate('#js_home', 'click', function () {
        self.home();
      });
    }
    if (this.header.phone) {
      this.$el.find('#js_phone').attr('href', 'tel:' + this.header.phone);
    }
    if (this.header.title) {
      this.$el.find('header h1').text(this.header.title);
    }
    if (this.header.subtitle) {
      this.$el.find('header p').text(this.header.subtitle);
    }
    if (this.header.rightAction) {
      this.$el.delegate('header div', 'click', this.header.rightAction);
    }
  };
  // *************************************************************************

  View._initializeFooter = function () {
    if(this.footer) this.footer.hide();
    if (cUtility.isInApp()) {
      return;
    }

    // @description 临时解决广告不消失问题
    if (this.hasAd && this.footer && !this.footer.isExpire()) {
      var ctn = this.adContainer ? this.$el.find('#' + this.adContainer) : $('#footer');
      var oldRootBox = this.footer.rootBox;
      if (oldRootBox && oldRootBox.attr('id') != ctn.attr('id')) {
        this.footer.remove();
        this.footer.isCreate = false;
      }
      this.footer.update({
        rootBox: ctn
      });
      this.footer.show();
    }
  };

  // @description 有渠道数据需要处理的在c.business.view中复写
  View.disposeChannel = function () {};

  View.__onLoad = function (lastViewName) {
    // @description 切换页面时，确保当前input失去焦点
    if (document.body) document.body.focus();

    this.getServerDate();

    // @description 设置渠道信息
    this.disposeChannel();

    // @description 获得默认的头部设置
    this.header = this._getDefaultHeader();

    // @description 切换状态
    this.state = this.ENUM_STATE_LOAD;

    if(typeof this.onLoad === 'function') this.onLoad(lastViewName);
  };

  //触发Show事件
  View.__onShow = function () {
    this.state = this.ENUM_STATE_SHOW;

    //fix scroll bug shbzhang 2013.10.10
    window.scrollTo(0, 0);

    if (typeof this.onShow === 'function') {
      this.onShow();
    };

    this._initializeHeader();
    this._initializeFooter();

    if (this.onBottomPull) {
      this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
      this.addScrollListener();
    }

    // @description 留出接口给onShow完成之后回调使用，处理onShow的业务逻辑
    this.onShowFinish();
  };

  View.onShowFinish = function () {};

  // *********************************************
  // @depricated
  // @description 兼容min-height，重置view高度
  View.resetViewMinHeight = function () {};
  // *********************************************

  View.__onHide = function (id) {

    // @description 切换状态
    this.state = this.ENUM_STATE_HIDE;

    if(typeof this.onHide === 'function')
      this.onHide(id);

    // @description 隐藏全局控件
    this.hideHeadWarning();
    this.hideWarning();
    this.hideLoading();
    this.hideWarning404();
    this.hideToast();

    if (this.onBottomPull) {
      this.removeScrollListener();
    }

    this.scrollPos = {
      x: window.scrollX,
      y: window.scrollY
    }

  };

  // @description 设置菊花出现
  View.showLoading = function () {
    this.loading.show();
  };

  // @description 设置菊花隐藏
  View.hideLoading = function () {
    this.loading.hide();
  };

  View.forward = function (url, replace) {
    this.appliction.forward.apply(null, arguments);
  };

  View.back = function (url) {
    // @description 在ios环境中使用application.back()会出现问题！
    // @description 作为一个调查点保留
    this.appliction.back.apply(null, arguments);
  };

  // ********************************************
  // @description 需要调整
  View.jump = function (url, replace) {
    // app环境不支持jump
    if (cUtility.isInApp()) {
      url = url.replace(window.BASEURL, '');
      this.forward(url);
    } else {
      if (replace) {
        window.location.replace(url);
      } else {
        window.location.href = url;
      }
    }
  };
  // ********************************************

  View.home = function () {
    this.appliction.forward('');
  };

  // @description 还原到原来的滚动条位置
  View.restoreScrollPos = function () {
    window.scrollTo(this.scrollPos.x, this.scrollPos.y);
  };

  /**
  * 获得url中查询字符串，类似于get的请求参数
  * @param name {String} 要查询参数的key
  * @return {String}
  * @demo
  * #ticketlist/?name=value
  * var v = this.getQuery('name');
  * console.log(v);//value;
  *
  */
  View.getQuery = function (name) {
    return this.request.query[name] || null;
  };

  /**
  * 获得url中路径中的某一部分
  * @param index {Number} 在路径中某个段的值
  * @param {String} 要查询的路径的value
  * @demo
  * #ticketlist/!value/hoe
  * var v = this.getPath(0);
  * console.log(v);//value;
  */
  View.getPath = function (index) {
    return this.request.path[index] || null;
  };

  View.getRoot = function () {
    return this.request.root || null;
  };

  View.showMessage = function (message, title) {
    this.alert.setViewData({ message: message, title: title });
    this.alert.show();
  };

  // -----------------------------------------------------
  // warning
  View.showWarning  = function (title, callback) {
    if (title) this.warning.setTitle(title, callback);
    this.warning.show();
  };

  View.hideWarning =  function () {
    this.warning.hide();
  };

  // -----------------------------------------------------
  // showHeadWarning
  View.showHeadWarning = function (title, content, callback) {
    if (title) this.headwarning.setTitle(title, content, callback);
    this.headwarning.show();
  };

  View.hideHeadWarning = function () {
    this.headwarning.hide();
  };

  // -----------------------------------------------------
  // showWarning404
  View.showWarning404 = function (callback) {
    if (callback) this.warning404.retryClick(callback);
    this.warning404.show();
  };

  View.hideWarning404 = function () {
    this.warning404.hide();
  };

  // -----------------------------------------------------
  // NoHeadWarning
  View.showNoHeadWarning = function (content, top) {
    if (content) this.NoHeadWarning.setContent(content, top);
    this.NoHeadWarning.show();
  };

  // -----------------------------------------------------
  // Toast
  View.showToast = function (title, timeout, callback, clickToHide) {
    if (this.toast.isShow()) {
      return;
    }
    clickToHide = (typeof clickToHide != 'undefined') ? clickToHide : true;
    this.toast.show(title, timeout, callback, clickToHide);
  };

  View.hideToast = function () {
    this.toast.hide();
  };

  // @description 更新Header
  View.updateHeader = function (options) {
    for (var key in options) {
      this.header[key] = options[key];
    }
    this._initializeHeader();
  };

  View._getDefaultHeader = function () {
    return {
      backUrl: null,
      home: false,
      phone: null,
      title: null,
      subtitle: null,
      rightAction: null
    };
  };

  // @description 获取服务端时间
  View.getServerDate = function (callback) {
    return cUtility.getServerDate(callback);
  };

  View.now = function () {
    return cUtility.getServerDate();
  };

  View.debug = function () {
    var debug = this.request.query['debug'] || localStorage.get('DEBUG');
    if (debug == 'yes') {
      $(window).unbind('error', debughander);
      $(window).bind('error', debughander);
      localStorage.set('DEBUG', debug, new cBase.Date(cBase.getServerDate()).addDay(1).valueOf());
    } else if (debug == 'no') {
      $(window).unbind('error', debughander);
      localStorage.remove('DEBUG');
    }
  };

  View._getAurl = function () {
    var url = this.request.root, param;
    if (this.request.viewpath) {
      url += "#" + this.request.viewpath;
    }
    if (this.request.path.length > 0) {
      param = $.param(this.request.query);
      url += "!" + this.request.path.join("/") + (param.length ? '?' + param : '');
    }
    return url;
  };

  //l_wang 新增
  View.setTitle = function (title) {
    document.title = title;
  };

  View.appendCss = function (styles) {
    if (!styles) return;
    for (var i = 0, len = styles.length; i < len; i++) {
      if (!this.css[styles[i]]) {
        this.head.append($('<link rel="stylesheet" type="text/css" href="' + styles[i] + '" />'));
        this.css[styles[i]] = true;
      }
    }
  };

  View.addClass = function (name) {
    this.$el.addClass(name);
  };

  View.removeClass = function (name) {
    this.$el.removeClass(name);
  };

  // @description 新增view load 方法，此方法会触发其onload事件
  View.__load = function () {
    this.__onLoad();
  };

  // @description 新增view 的show方法
  View.__show = function () {

    //在快速前进或是返回时，viewport会莫名其妙丢失view
    //这里强制判断，不存在则强行插入。
    if (!this.viewport.find('#id_' + this.id).length) {
      this.viewport.append(this.$el);
    }

    this.$el.show();
    this.__onShow();
  };

  //新增view 的hide方法
  View.__hide = function () {

    this.$el.hide();
    this.__onHide();
  }

  return Backbone.View.extend(View);

});
