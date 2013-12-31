/**********************************
* @author:       cmli@Ctrip.com
* @description:  组件HeaderView
*/
define(['cBase', 'cUICore', 'cWidgetFactory', 'cUtility', 'cSales', 'cHybridFacade'], function (cBase, cUICore, WidgetFactory, cUtlity, cSales, Facade) {
    "use strict";

    var WIDGET_NAME = 'HeaderView';

    // 如果WidgetFactory已经注册了HeaderView，就无需重复注册
    if (WidgetFactory.hasWidget(WIDGET_NAME)) {
        return;
    }

    //var Publisher = new WidgetFactory.create('Publisher');

    var _setView = function () {
        var view = this.templateFactory(this.data);
        return $(view);
    };

    var _setTemplate = function (config) {
        this.html = '';
        if (config && config.data) {
            for (var key in this.htmlMap) {
                if (config.data[key]) {
                    this.html += this.htmlMap[key];
                }
            }
            var style = '',
              cstyle = config.data['style'];
            if (cstyle) {
                style = ' style="' + cstyle + '"';
            }

            this.html = '<header' + style + '>' + this.html + '</header>';
        }
    };

    var options = options || {};

    options.__propertys__ = function () { };

    /********************************
    * @description: HeaderView初始化，主要是配置rootBox、绑定按钮事件
    */
    options.initialize = function ($super, config) {
        if (config) {
            this.rootBox = config.container || $('<div id="headerview"></div>');
            this.data = config.data;
            this.html = config.html || this.html;
            if (this.data) {
                this.bindEvents = config.data.bindEvents || function () { };
            }
            _setTemplate.call(this, config);
            config.onShow = this.onShow;
        } else {
            this.rootBox = $('<div id="headerview"></div>');
            config = {
                onShow: this.onShow
            };
        }

        $super(config);
    };

    /********************************
    * @description: 通过模板和开发者传入的数据生成HeaderView
    */
    options.createHtml = function () {
        if (this.html) {
            this.templateFactory = this.template(this.html);
            return _setView.call(this);
        } else {
            return;
        }
    };

    /********************************
    * @description: onShow时候的回调，绑定headerview上的事件
    */
    options.onShow = function () {
        this.rootBox.off('click');

        if (this.data && this.data.btn && typeof this.bindEvents === "function") {
            console.log('onshow');
            this.bindEvents(this.getView());
        }

        if (this.data && this.data.events) {
            this.delegateEvents(this.data.events, this.data.view);
        }

        if (this.data && this.data.commit) {
            var commit = this.data.commit;
            var view = this.getView();
            var self = this;

            var callback = function () {
                commit.callback.call(self.view);
            };
            view.find('#' + commit.id).on('click', callback);

            // ?会导致不能出现吗
            // var Publisher = new WidgetFactory.create('Publisher');
            //Publisher.register({ name: 'commit', callback: callback });
            Facade.register({ tagname: Facade.METHOD_COMMIT, callback: callback });
        }
    };

    /********************************
    * @description:  设置HeaderView数据
    * @param:        [optional]{data.title} String 设置HeaderView的显示的栏目标题
    * @param:        [optional]{data.tel} JSON 设置电话链接按钮 tel:{number: 56973183}
    * @param:        [optional]{data.home} boolean 是否需要显示Home按钮
    * @param:        [optional]{data.btn} JSON {title: "完成", id: 'confirmBtn', classname: 'bluebtn'}
    * @param:        [optional]{data.back} boolean 是否需要显示返回按钮
    * @param:        [optional]{data.custom} String 需要设置的自定义html
    * @param:        [optional]{data.events} JSON 设置需要的按钮点击回调事件 { homeHandler: function, returnHandler: function}
    * @param:        [optional]{data.view} function 当前的作用域constructor
    * @param:        [optional]{data.bindEvents} function($el){} $el是当前headerview的$对象，与btn或custom共同设置
    * @param:        [optional]{data.openAds} boolen 是否显示广告，默认为不显示
    * @param:        [optional]{data.commit} JSON {id: '', callback: ''}
    * @return:       $对象
    *
    * 举例来说 data{title: "选择出发地", home: 'true', back: true, events: {homeHandler: function(){console.log('click home')}}};
    *
    */
    options.set = function (data) {
        if (data) {
            this.data = data;
            _setTemplate.call(this, { data: data });
            // var view = this.createHtml();
            //如果打开广告配置
            /* if (data.openAds) {
            var AdView = WidgetFactory.create('AdView');
            this.adView = new AdView(data);
            }*/
            this.bindEvents = this.data.bindEvents;
            this.isCreate = false;
            this.hide();
            //this.headerview.status = cBase.;
            // return $(view);
        }
    };

    /********************************
    * @description:  设置HeaderView数据
    * @param:        [optional]{data.title} String 设置HeaderView的显示的栏目标题
    * @param:        [optional]{data.tel} JSON 设置电话链接按钮 tel:{number: 56973183}
    * @param:        [optional]{data.home} boolean 是否需要显示Home按钮
    * @param:        [optional]{data.btn} JSON {name: "完成", id: 'confirmBtn', classname: 'bluebtn'}
    * @param:        [optional]{data.back} boolean 是否需要显示返回按钮
    * @param:        [optional]{data.custom} String 需要设置的自定义html
    * @param:        [optional]{data.events} JSON 设置需要的按钮点击回调事件 { homeHandler: function, returnHandler: function}
    * @param:        [optional]{data.view} function 当前的作用域constructor
    * @param:        [optional]{data.bindEvents} function($el){} $el是当前headerview的$对象，与btn或custom共同设置
    * @param:        [optional]{data.commit} JSON {id: '', callback: ''}
    */
    options.reset = function (data) {
        if (data) {
            this.set(data);
            this.trigger('onShow');
        }
    };

    /********************************
    * @description: 向HeaderView的控件按钮绑定事件
    */
    options.delegateEvents = function (events, view) {
        if (events) {
            _setBindBtnAction.call(this, '#c-ui-header-home', 'click', events.homeHandler, view);
            _setBindBtnAction.call(this, '#c-ui-header-return', 'click', events.returnHandler, view);

            var self = this;
            var callback = function () {
                events.returnHandler.call(view || self);
            }

            // var Publisher = new WidgetFactory.create('Publisher');
            // Publisher.register({ name: 'back', callback: callback });
            Facade.register({ tagname: Facade.METHOD_BACK, callback: callback });
        }
    };

    var _setBindBtnAction = function (selector, sign, action, view) {
        this.rootBox.find(selector).on(sign, function () {
            action.call(view || this);
        });
    };

    /********************************
    * @description: 获取HeaderView的$(dom)
    */
    options.getView = function () {
        return this.rootBox;
    };

    /********************************
    * @destription: 更新HeaderView
    */
    options.updateHeader = function (name, val) {
        this.data[name] = val;
        //this.reset(this.data);
        this.set(this.data);
        this.show();
    };
    /********************************
    * @description: 默认的HeaderView模板
    */
    options.html = null;
    options.htmlMap = {
        home: '<i class="icon_home i_bef" id="c-ui-header-home"></i>',
        tel: '<a href="tel:<%=tel.number||4000086666 %>" class="icon_phone i_bef __hreftel__" id="c-ui-header-tel"></a>',
        title: '<h1><%=title %></h1>',
        back: '<i id="c-ui-header-return" class="returnico i_bef"></i>',
        btn: '<i id="<%=btn.id%>" class="<%=btn.classname%>"><%=btn.title %></i>',
        custom: '<%=custom %>'
    };

    //重写create方法，支持新的html结构
    options.create = function () {
        if (!this.isCreate && this.status !== cUICore.AbstractView.STATE_ONCREATE) {
            this.rootBox = this.rootBox || $('body');
            this.rootBox.empty();
            this.root = $(this.createHtml());
            this.rootBox.append(this.root);
            setTimeout($.proxy(function () {
                cSales.replaceContent(this.root);
            }, this), 200);
            this.rootBox.css('height', this.root.css('height'));
            this.trigger('onCreate');
            this.status = cUICore.AbstractView.STATE_ONCREATE;
            this.isCreate = true;
        }
        //如果配置打开了advertisment
        /* if (this.adView) {
        if (this.data.openAds) {
        //this.adView.trigger('onShow');
        this.adView.show();
        } else {
        this.adView.hide();
        }
        }*/
    };

    //重写showAction方法，以使其支持app嵌入
    options.showAction = function (callback) {
        if (cUtlity.isInApp()) {
            this.rootBox.hide();
            this.saveHead();
        } else {
            this.root.show();
        }
        callback();
    };

    //保存数据到Localstorg,供APP使用
    options.saveHead = function () {
        var head = {
            'left': [],
            'center': [],
            'right': []
        }, obj = this.data;

        if (obj.back) {
            head.left.push({ 'tagname': 'back' });
        }
        if (obj.title) {
            head.center.push({ 'tagname': 'title', 'value': obj.title });
        }
        if (obj.btn) {
            head.right.push({ 'tagname': 'commit', 'value': obj.btn.title });
        }
        if (obj.tel) {
            head.right.push({ 'tagname': 'call' });
        }
        if (obj.home) {
            head.right.push({ 'tagname': 'home' });
        }

        try {
            //window.localStorage.setItem('HEAD', JSON.stringify(head));
            //var date = new Date();
            //window.location.hash += '|L-HEAD-' + date.getTime();

            // ? 需要做URI encode还是JSON.stringify ?
            // var headInfo = window.encodeURIComponent(head);
            var headInfo = JSON.stringify(head);
            // app_refresh_nav_bar(headInfo);
            Facade.request({ name: Facade.METHOD_REFRESH_NAV_BAR, config: headInfo });

        } catch (e) {
            // console.warn('浏览器不支持localStorage');
        }

    };

    //var HeaderView = new cBase.Class(cUICore.AbstractView, options);
    //单例模式
    function HeaderView(propertys) {
        if (HeaderView.instance) {
            HeaderView.instance.reset(propertys);
            return HeaderView.instance;
        } else {
            var Header = new cBase.Class(cUICore.AbstractView, options);
            return HeaderView.instance = new Header(propertys);
        }
    }

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: HeaderView
    });

});
