define(['libs', 'c', 'cUIAnimation', 'cUtility', 'cWidgetFactory', 'cWidgetGuider'], function (libs, c, animation, Util, WidgetFactory) {
  var cBase = c.base;
  var loadHtml_sanya = '手机预订三亚门票，价格最低';
  var loadHtml_h2 = '';
  var Appliction = new c.base.Class({
    __propertys__: function () {
      this.webroot = '/#hotelsearch';
      //head
      this.head = $('head');
      //body
      this.body = $('body');
      //view搜索目录
      this.viewRootPath = 'app/views/';
      //默认view
      this.defaultView = 'index';
      //请求对象
      this.request;
      //当前视图路径
      this.viewpath;
      //主框架
      this.mainframe;
      //视图框架
      this.viewport;
      //状态框架
      this.statedom;
      //视图集
      this.views = new c.base.Hash();
      //页面最大长度
      this.maxLength = 5;
      //当前视图
      this.curView;
      //提供给视图访问Appliction的接口
      this.inteface = {
        loadView: _.bind(this.loadView, this),
        forward: _.bind(this.forward, this),
        hideLoading: _.bind(this.hideLoading, this),
        showLoading: _.bind(this.showLoading, this),
        turning: _.bind(this.turning, this),
        back: _.bind(this.back, this),
        setTitle: _.bind(this.setTitle, this),
        //加入css样式文件，
        appendCss: _.bind(this.appendCss, this)
      };
      //结构是否创建好
      this.isCreate = false;
      //历史记录
      this.history = [];
      //loading框
      this.loading;
      //页面中的css文件
      this.css = {};
      //hash的监听状态
      this.stopListening = false;
      this.onHashChange = _.bind(function () {
        this.history.push(window.location.href);
        if (!this.stopListening) {
          var url = decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase();
          this._onHashChange(url);
        }

      }, this);

      //l_wang update(2013/10/14) 解决快速点击浏览器后退动画切换过快导致页面闪烁
      //            this.lazyLoadView = false; //处理系统后退键过快情况
      //            this.onHashChange = _.bind(function () {
      //                var scope = this;
      //                if (this.lazyLoadView == false) {
      //                    this.history.push(window.location.href);
      //                    if (!this.stopListening) {
      //                        var url = decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase();
      //                        this._onHashChange(url);
      //                        scope.lazyLoadView = true;
      //                        setTimeout(function () {
      //                            scope.lazyLoadView = false;
      //                        }, 200);
      //                    }
      //                }
      //            }, this);

      //翻页动作
      this._turning = function () { };
      //资源
      this.timeoutres;
      //上一次hash
      this.lastHash = '';
      //上一次完整hash
      this.lashFullHash = '';
      //hash是否改变
      this.isChangeHash = false;

      this.animations = animation;
      //是否使用动画
      this.isAnimat = true;
      this.isinapp = cBase.isInApp();

      //            this.isinapp = true;
      //UC浏览器判断
      if (navigator.userAgent.toLowerCase().indexOf('ucbrowser') > 0) {
        //$('body').css('border', '5px solid #f5f5f5');
        this.isinapp = false;
      }

      //直接切换非动画处理函数
      this.notAnimatHandler = animation.fadeIn;

      //向前动画名
      this.animForwardName = 'slideleft';
      this.animBackwardName = 'slideright';
      this.path = [];
      this.query = {};
      this.viewMapping = {};
    },
    buildUrl: function (path) {
      var mappingPath = this.viewMapping[path];
      return mappingPath ? mappingPath : this.viewRootPath + path;
    },
    initialize: function (options) {
      this.setOption(options);
      //this.createViewPort();
      this.buildEvent();
      this.createCommonUI();

      //var Publisher = WidgetFactory.create('Publisher');

      // ---------初始化设置-------------
      //Publisher.setApi();
      //Publisher.register({ name: 'login' });
      // Publisher.requestEntryInfo();
      // app_entry();

      var Guider = WidgetFactory.create('Guider');
      Guider.create();

    },
    setOption: function (options) {
      options = options || {};
      for (var i in options) {
        switch (i) {
          case 'defaultView':
          case 'viewRootPath':
          case 'maxLength':
          case 'webroot':
          case 'path':
          case 'query':
          case 'baseUrl':
          case 'viewRootPathMap':
          case 'viewMapping':
            this[i] = options[i];
            break;
        }
      }
    },
    lastUrl: function () {
      if (this.history.length < 2) {
        return document.referrer;
      } else {
        return this.history[this.history.length - 2];
      }
    },
    setTitle: function (title) {
      document.title = title;
    },
    localObserver: function (req, isForward) {
      var animatName = isForward ? this.animForwardName : this.animBackwardName;
      this.request = req;
      this.viewpath = this.request.viewpath || this.defaultView;
      this.request.viewpath = this.viewpath;
      this.switchView(this.viewpath, animatName);
    },
    startObserver: function () {
      this.stopListening = false;
    },
    endObserver: function () {
      this.stopListening = true;
    },
    showLoading: function () {
      var url = window.location.hash.replace(/^#+/i, '');
      var channel = url.substring(0, url.indexOf('/'));
      switch (channel) {
        case 'vevent':
          this.loading.setHtml(loadHtml_sanya);
          break;
        default:
          this.loading.setHtml(loadHtml_h2);
          break;
      }
      this.loading.show();
    },
    hideLoading: function () {
      this.loading.hide();
    },
    createViewPort: function () {
      if (this.isCreate) return;
      var html = [
                '<div class="main-frame">',
                    '<div class="main-viewport"></div>',
                    '<div class="main-state"></div>',
                '</div>'
            ].join('');
      this.mainframe = $(html);
      this.viewport = this.mainframe.find('.main-viewport');
      this.statedom = this.mainframe.find('.main-state');
      var container = $('#main');
      container.empty();
      container.append(this.mainframe);
      this.isCreate = true;
    },
    createCommonUI: function () {
      this.loading = new c.ui.Loading();
    },
    buildEvent: function () {
      var self = this;
      requirejs.onError = function (e) {
        if (e && e.requireModules) {
          for (var i = 0; i < e.requireModules.length; i++) {
            var toast = new c.ui.Toast();
            //'404: ' + (e.requireModules[i] || '').replace(self.viewRootPath, '') + '页面不存在!' update caofu 2013-09-06
            toast.show('抱歉，当前的网络状况不给力，请刷新重试!', 2, function () {
              self.hideLoading();
              //self.back();
            });
          }
        }
      };
      $(window).bind('hashchange', this.onHashChange);
      this.onHashChange();

      //l_wang提升响应速度
      $.bindFastClick && $.bindFastClick();
    },
    //切换页面
    switchView: function (path, animatName) {
      var id = path;
      var view = this.views.getItem(id), lastView, curView;
      if (!view) {
        this.loadView(path, function (View) {
          if (this.curView) {
            typeof this.curView.__onHide == 'function' && this.curView.__onHide(id);
            lastView = this.curView;
            this.curView = new View(this.request, this.inteface, id);
            this.views.push(id, this.curView);
            curView = this.curView;
            this._turning = _.bind(function () {
              this.createViewPort();
              curView.$el.show();
              this.viewport.append(curView.$el);
              //                            window.scrollTo(0, 1);
              this.startAnimation(curView, lastView, animatName, $.proxy(function () {
                this.views.each(function (view, path) {
                  if (curView === view || lastView === view) return false;
                  view.$el.hide();
                });
                curView.__onShow && curView.__onShow();
              }, this));
            }, this);
          } else {
            this.curView = new View(this.request, this.inteface, id);
            this.views.push(id, this.curView);
            curView = this.curView;
            this._turning = _.bind(function () {
              this.createViewPort();
              curView.$el.show();
              this.viewport.append(curView.$el);
              window.scrollTo(0, 1);
              curView.__onShow && curView.__onShow();
            }, this);
          }
          var lastViewName = (lastView || this.curView).viewname;
          typeof this.curView.__onLoad == 'function' && this.curView.__onLoad(lastViewName);

          if (this.views.length() > this.maxLength && this.views.length() > 2) {
            //todo，删除view的操作
          }
        });
      } else {
        if (this.curView && this.curView !== view) {
          this.curView.request = this.request;
          typeof this.curView.__onHide == 'function' && this.curView.__onHide(id);
          lastView = this.curView;
          this.curView = view;
          curView = this.curView;
          curView.request = this.request;
          this._turning = _.bind(function () {
            this.createViewPort();
            curView.$el.show();
            //                        window.scrollTo(0, 1);
            this.startAnimation(curView, lastView, animatName, $.proxy(function () {
              this.views.each(function (view, path) {
                if (curView === view || lastView === view) return false;
                view.$el.hide();
              });
              //在快速前进或是返回时，viewport会莫名其妙丢失view，这里强制判断，不存在则强行插入。
              if (!this.viewport.find('#id_' + curView.id).length) {
                this.viewport.append(curView.$el);
              }
              curView.__onShow && curView.__onShow();
            }, this));
          }, this);
          var lastViewName = (lastView || this.curView).viewname;
          typeof this.curView.__onLoad == 'function' && this.curView.__onLoad(lastViewName);
          this.views.push(id, view, true);
        } else if (this.isChangeHash) {
          this.curView.request = this.request;
          curView = this.curView;
          this._turning = _.bind(function () {
            this.createViewPort();
            curView.$el.show();
            window.scrollTo(0, 1);
            //在快速前进或是返回时，viewport会莫名其妙丢失view，这里强制判断，不存在则强行插入。
            if (!this.viewport.find('#id_' + curView.id).length) {
              this.viewport.append(curView.$el);
            }
            curView.__onShow && curView.__onShow();
          }, this);
          var lastViewName = (lastView || this.curView).viewname;
          typeof this.curView.__onLoad == 'function' && this.curView.__onLoad(lastViewName);
        }
      }
    },
    appendCss: function (styles) {
      if (!styles) return;
      for (var i = 0, len = styles.length; i < len; i++) {
        if (!this.css[styles[i]]) {
          this.head.append($('<link rel="stylesheet" type="text/css" href="' + styles[i] + '" />'));
          this.css[styles[i]] = true;
        }
      }
    },
    turning: function () {
      this._turning();
    },
    startAnimation: function (inView, outView, animatName, callback) {
      animatName = animatName || this.animBackwardName;
      //当非app中则不使用动画
      if (!this.isinapp) this.isAnimat = false;
      if (this.isAnimat) {
        this.timeoutres = this.animations[animatName] && this.animations[animatName].call(this, inView, outView, callback, this);
      } else {
        this.timeoutres = this.notAnimatHandler(inView, outView, callback, this);
      }
      //此参数为一次性，调用一次后自动打开动画
      this.isAnimat = true;
      //            return this.timeoutres;
    },
    //加载view
    loadView: function (path, callback) {
      var self = this;
      requirejs([this.buildUrl(path)], function (View) {
        callback && callback.call(self, View);
      });
    },
    _onHashChange: function (url, isForward) {
      url = url.replace(/^#+/i, '');
      var req = this.parseHash(url);
      this.localObserver(req, isForward);
    },
    forward: function (url, replace, isNotAnimat) {
      url = url.toLowerCase();
      if (isNotAnimat) this.isAnimat = false;
      this.endObserver();
      if (replace) {
        window.location.replace(('#' + url).replace(/^#+/, '#'));
      } else {
        window.location.href = ('#' + url).replace(/^#+/, '#');
      }
      this._onHashChange(url, true);
      setTimeout(_.bind(this.startObserver, this), 1);
    },
    parseHash: function (hash) {
      var fullhash = hash,
                hash = hash.replace(/([^\|]*)(?:\|.*)?$/img, '$1'),
                h = /^([^?&|]*)(.*)?$/i.exec(hash),
                vp = h[1] ? h[1].split('!') : [],
                viewpath = (vp.shift() || '').replace(/(^\/+|\/+$)/i, ''),
                path = vp.length ? vp.join('!').replace(/(^\/+|\/+$)/i, '').split('/') : this.path,
                q = (h[2] || '').replace(/^\?*/i, '').split('&'),
                query = _.clone(this.query), y, qn;
      this.isChangeHash = !!(!this.lastHash && fullhash === this.lashFullHash) || !!(this.lastHash && this.lastHash !== hash);
      if (q) {
        for (var i = 0; i < q.length; i++) {
          if (q[i]) {
            y = q[i].split('=');
            y[1] ? (qn = y.shift(), query[qn] = y.join('=')) : (query[y[0]] = '');
          }
        }
      }

      this.lastHash = hash;
      this.lashFullHash = fullhash;
      return {
        viewpath: viewpath,
        path: path,
        query: query,
        root: location.pathname + location.search,
        fullhash: fullhash
      };
    },
    back: function (url, isNotAnimat) {
      if (isNotAnimat) this.isAnimat = false;
      var referrer = this.lastUrl();
      if (url && (!referrer || referrer.indexOf(url) !== 0)) {
        window.location.hash = url;
      } else {
        history.back();
      }
    }

  });
  return Appliction;
});
