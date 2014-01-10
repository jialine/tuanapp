define(['libs', 'cBase', 'cUIAnimation'], function (libs, cBase, animation) {

  var Appliction = new cBase.Class({
    __propertys__: function () {
      this.webroot = '/#hotelsearch';

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
      this.views = new cBase.Hash();
      //当前视图
      this.curView;
      //最后访问视图视图
      this.lastView;

      //提供给视图访问Appliction的接口
      this.inteface = {
        loadView: _.bind(this.loadView, this),
        forward: _.bind(this.forward, this),
        back: _.bind(this.back, this)
      };
      //结构是否创建好
      this.isCreate = false;
      //历史记录
      this.history = [];
      //hash的监听状态
      this.stopListening = false;

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

      this.isinapp = true;

      //向前动画名
      this.animForwardName = 'slideleft';
      this.animBackwardName = 'slideright';
      this.animNoName = 'noAnimate';

      //动画名
      this.animatName = this.animNoName;

      this.path = [];
      this.query = {};
      this.viewMapping = {};
    },

    initialize: function (options) {
      this.setOption(options);
      //this.createViewPort();
      this.buildEvent();

    },
    setOption: function (options) {
      options = options || {};
      for (var i in options) {
        switch (i) {
          case 'defaultView':
          case 'viewRootPath':
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

    buildEvent: function () {
      var self = this;
      requirejs.onError = function (e) {
        if (e && e.requireModules) {
          for (var i = 0; i < e.requireModules.length; i++) {
            alert('抱歉，当前的网络状况不给力，请刷新重试!');
            break;
          }
        }
      };

      $(window).bind('hashchange', _.bind(this.onHashChange, this));

      //首次必须执行该方法加载相关view
      this.onHashChange();

    },

    onHashChange: function () {
      var href = window.history.length;
      this.history.push(window.location.href);

      //首次为false，不在监听时候才能触发_onHashChange 切换view
      if (!this.stopListening) {
        var url = decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase();
        this._onHashChange(url);
      }
    },

    _onHashChange: function (url, isForward) {
      url = url.replace(/^#+/i, '');
      var req = this.parseHash(url);
      this.localObserver(req, isForward);
    },
    //处理URLhash
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
    //hashchange观察点函数，处理url，动画参数
    localObserver: function (req, isForward) {
      this.animatName = isForward ? this.animForwardName : this.animBackwardName;

      this.request = req;
      this.viewpath = this.request.viewpath || this.defaultView;
      this.request.viewpath = this.viewpath;
      this.switchView(this.viewpath);
    },


    //根据根据id以及页面的类
    //定义view的turing方法，这里不是直接放出去，而是通过app接口放出，并会触发各个阶段的方法
    //注意，这里是传递id，有可能乱跳，
    switchView: function (path) {
      var id = path;
      var curView = this.views.getItem(id);

      //切换前的当前view，马上会隐藏
      var lastView = this.curView;

      //如果当前view存在则触发其onHide事件，做资源清理
      //但是如果当前view就是 马上要访问的view的话，这里就不会触发他的onHide事件
      //所以lastview可能并不存在
      if (lastView && lastView != curView) {
        this.lastView = lastView;
      }

      //如果当前view存在，则执行请onload事件
      if (curView) {
        //因为初始化只会执行一次，所以每次需要重写request
        curView.request = this.request;
        //这里有一个问题，view与view之间并不需要知道上一个view是什么，下一个是什么，这个接口应该在app中
        this.curView = curView;
        this.curView.__load();

      } else {
        //重来没有加载过view的话需要异步加载文件
        //此处快速切换可能导致view文件未加载结束，而已经开始执行其它view的逻辑而没有加入dom结构
        this.loadView(path, function (View) {
          curView = new View(this.request, this.inteface, id);

          //保存至队列
          this.views.push(id, curView);

          //这个是唯一需要改变的
          curView.turning = _.bind(function () {
            this.createViewPort();
            curView.viewport = this.viewport;
            //            curView.$el.focus();

            //动画会触发inView的show outView 的hide
            this.startAnimation(function (inView, outView) {
              //防止view显示错误，后面点去掉
              this.views.each(function (view, path) {
                if (inView === view || outView === view) return false;
                view.$el.hide();
              });

            });

          }, this);

          this.curView = curView;
          this.curView.__load();

        });
      }
    },

    //动画相关参数，这里要做修改，给一个noAnimat
    startAnimation: function (callback) {
      var inView = this.curView;
      var outView = this.lastView;

      //当非app中则不使用动画
      if (!this.isinapp) this.isAnimat = false;

      if (!this.isAnimat) this.animatName = this.animNoName;

      this.timeoutres = this.animations[this.animatName] && this.animations[this.animatName].call(this, inView, outView, callback, this);

      //此参数为一次性，调用一次后自动打开动画
      this.isAnimat = true;
    },

    //加载view
    loadView: function (path, callback) {
      var self = this;
      requirejs([this.buildUrl(path)], function (View) {
        callback && callback.call(self, View);
      });
    },

    buildUrl: function (path) {
      var mappingPath = this.viewMapping[path];
      return mappingPath ? mappingPath : this.viewRootPath + path;
    },

    //创建dom结构
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

    lastUrl: function () {
      if (this.history.length < 2) {
        return document.referrer;
      } else {
        return this.history[this.history.length - 2];
      }
    },

    startObserver: function () {
      this.stopListening = false;
    },

    endObserver: function () {
      this.stopListening = true;
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

    back: function (url, isNotAnimat) {
      if (isNotAnimat) this.isAnimat = false;
      var referrer = this.lastUrl();
      if (url && (!referrer || referrer.indexOf(url) !== 0)) {
        window.location.hash = url;
      } else {
        url = this.request.query['refer'];
        if (url) {
          window.location.href = url;
        } else {
          history.back();
        }
      }
    }

  });
  return Appliction;
});
