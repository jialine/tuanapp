/* File Created: 六月 23, 2013 */

define(['libs', 'cUI', 'cSales', 'cStorage', 'cBase', 'CommonStore', 'cUtility', 'cAdView'], function (libs, cUI, cSales, cStorage, cBase, CommonStore, cUtility, cAdView) {
    function debughander(e, on, line) {
        if (e && e.originalEvent) alert(e.originalEvent.message + ' ' + on + ' ' + line);
    };
    var localStorage = cStorage.localStorage;
    //用于切换页面时，让当前input失去焦点
    document.body && (document.body.tabIndex = 10000);
    return Backbone.View.extend({

        ENUM_STATE_NOCREATE: 0,
        ENUM_STATE_CREATE: 1,
        ENUM_STATE_LOAD: 2,
        ENUM_STATE_SHOW: 3,
        ENUM_STATE_HIDE: 4,
        //子类可以设置此pageid，用于autotest
        pageid: 0,
        //视图的scroll位置
        scrollPos: {
            x: 0,
            y: 0
        },
        header: null,
        footer: null,
        cSales: cSales,
        // ui controller
        warning: null,
        alert: null,
        // ------------

        onCreate: function () { },
        viewInitialize: function () { },
        initialize: function (request, appliction, viewname) {
            this.$el.addClass('sub-viewport');
            this.id = _.uniqueId('viewport');
            this.$el.attr('id', 'id_' + this.id);
            this.viewname = viewname;
            //添加自定义pageid
            if (this.pageid) this.$el.attr('page-id', this.pageid);

            this.viewdata = {};
            this.appliction = appliction;
            this.request = request;
            this.$el.attr('page-url', this.request.viewpath);
            this.state = this.ENUM_STATE_CREATE;

            //初始化alert
            this.alert = new cUI.Alert({
                title: '提示信息',
                message: '',
                buttons: [{
                    text: '知道了',
                    click: function () {
                        this.hide();
                    }
                }
                ]
            });
            //初始化warning
            this.warning = new cUI.Warning({
                title: ''
            });
            //初始化headwarning
            this.headwarning = new cUI.HeadWarning({
                title: ''
            });

            //初始化headwarning
            // this.NoHeadWarning = new cUI.NoHeadWarning({
            //     content: ''
            // });

            //初始化404提示
            this.warning404 = new cUI.Warning404();

            //初始化toast
            this.toast = new cUI.Toast();
            //加入页面自定义的css
            if (_.isArray(this.css)) {
                this.appliction.appendCss(this.css);
            }
            //广告
            if(cAdView){
              this.footer =   cAdView.getInstance();
            }

            this.debug();
            try {
                this.onCreate();
            } catch (e) {
                //alert(this.request.viewpath+'/onCreate/Error:'+JSON.stringify(e));
            }
        },
        _initializeHeader: function () {
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
        },
        _initializeFooter: function () {
            this.footer.hide();
            this.footer.isCreate = false;
            if (cUtility.isInApp()) {
                return;
            }

            //临时解决广告不消失问题
            if (this.hasAd && !this.footer.isExpire()) {
                var ctn = this.adContainer ? this.$el.find('#' + this.adContainer) : $('#footer');
                this.footer.update({
                    rootBox: ctn
                });
                this.footer.show();
            }
        },

        //触发load事件
        __onLoad: function (lastViewName) {
            //切换页面时，确保当前input失去焦点
            document.body && document.body.focus();
            this.getServerDate();
            //处理渠道信息
            this.disposeChannel();
            this.header = this._getDefaultHeader();
            this.state = this.ENUM_STATE_LOAD;
            try {
                this.onLoad && this.onLoad(lastViewName);
            } catch (e) {
                //alert(this.request.viewpath+'/onLoad/Error:'+JSON.stringify(e));
            }
        },
        //触发Show事件
        __onShow: function () {
            this.state = this.ENUM_STATE_SHOW;
            //fix scroll bug shbzhang 2013.10.10
            window.scrollTo(0, 0);
            try {
                this.onShow && this.onShow();
            } catch (e) {
                //alert(this.request.viewpath + '/onShow/Error:' + JSON.stringify(e));
            }
            this._initializeHeader();
            this._initializeFooter();
            this.__updateSales(this.$el);
            if (this.onBottomPull) {
                this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
                this.addScrollListener();
            }
            //ga统计
            this._sendGa();
            //ubt统计
            if (!location.host.match(/localhost|172\.16|127\.0|210\.13/ig)) {
                this._sendUbt();
            }
            //Kenshoo统计
            this._sendKenshoo();
            this.resetViewMinHeight();
        },
        //兼容min-height，重置view高度
        resetViewMinHeight: function () {
            //暂时兼容性处理
            //            var main = $('#main');
            //            var main_frame = main.find('.main-frame');
            //            var main_viewport = main_frame.find('.main-viewport');
            //            var sub_viewport = main_viewport.find('.sub-viewport');
            //            var h = $(window).height();
            //            $('body').css('min-height', h);
            //            main.css('min-height', h);
            //            main_frame.css('min-height', h);
            //            main_viewport.css('min-height', h);
            //            sub_viewport.css('min-height', h);

        },
        //触发hide事件
        __onHide: function (id) {
            this.state = this.ENUM_STATE_HIDE;
            this.onHide && this.onHide(id);
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
        },
        turning: function () {
            this.appliction.turning();
        },
        showLoading: function () {
            //            var scope = this;
            //            //解决页面切换时过快的loading框消失一闪而过问题
            //            this.loadingTimer = setTimeout(function () {
            this.appliction.showLoading();
            //            }, 50)
        },
        hideLoading: function () {
            if (this.loadingTimer) clearTimeout(this.loadingTimer);
            this.appliction.hideLoading();
        },
        forward: function (url, replace) {
            this.appliction.forward.apply(null, arguments);
        },
        back: function (url) {
            // 在ios环境中使用application.back()会出现问题！
            // 作为一个调查点保留
            // if (cUtility.isInApp()) {
            // this.appliction.forward(url);
            // } else {
            this.appliction.back.apply(null, arguments);
            // }
        },
        jump: function (url, replace) {
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
        },
        home: function () {
            this.appliction.forward('');
        },
        setTitle: function (title) {
            this.appliction.setTitle("携程旅行网-" + title);
        },
        //还原到原来的滚动条位置
        restoreScrollPos: function () {
            window.scrollTo(this.scrollPos.x, this.scrollPos.y);
        },
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
        getQuery: function (name) {
            return this.request.query[name] || null;
        },
        /**
        * 获得url中路径中的某一部分
        * @param index {Number} 在路径中某个段的值
        * @param {String} 要查询的路径的value
        * @demo
        * #ticketlist/!value/hoe
        * var v = this.getPath(0);
        * console.log(v);//value;
        */
        getPath: function (index) {
            return this.request.path[index] || null;
        },
        getRoot: function () {
            return this.request.root || null;
        },
        showMessage: function (message, title) {
            this.alert.setViewData({
                message: message,
                title: title
            });
            this.alert.show();
        },
        showWarning: function (title, callback) {
            if (title) this.warning.setTitle(title, callback);
            this.warning.show();
        },
        hideWarning: function () {
            this.warning.hide();
        },
        showHeadWarning: function (title, content, callback) {
            if (title) this.headwarning.setTitle(title, content, callback);
            this.headwarning.show();
        },

        hideHeadWarning: function () {
            this.headwarning.hide();
        },

        showWarning404: function (callback) {
            if (callback) this.warning404.retryClick(callback);
            this.warning404.show();
        },

        hideWarning404: function () {
            this.warning404.hide();
        },

        showNoHeadWarning: function (content, top) {
            if (content) this.NoHeadWarning.setContent(content, top);
            this.NoHeadWarning.show();
        },
        hideNoHeadWarning: function () {
            this.NoHeadWarning.hide();
        },
        showToast: function (title, timeout, callback, clickToHide) {
            if (this.toast.isShow()) {
                return;
            }

            clickToHide = (typeof clickToHide != 'undefined') ? clickToHide : true;

            this.toast.show(title, timeout, callback, clickToHide);
        },
        hideToast: function () {
            this.toast.hide();
        },
        updateHeader: function (options) {
            for (var key in options) {
                this.header[key] = options[key];
            }
            this._initializeHeader();
        },
        _getDefaultHeader: function () {
            return {
                backUrl: null,
                home: false,
                phone: null,
                title: null,
                subtitle: null,
                rightAction: null
            };
        },
        __updateSales: function ($el) {
            var local = location.host,
                refUrl = document.referrer,
                seosales = '';
            if (local && refUrl.indexOf(local) === -1) {
                refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
                if (refUrl.indexOf('baidu') > -1) { seosales = 'SEO_BAIDU'; }
                if (refUrl.indexOf('google') > -1) { seosales = 'SEO_GOOGLE'; }
                if (refUrl.indexOf('soso.com') > -1) { seosales = 'SEO_SOSO'; }
                if (refUrl.indexOf('sogou') > -1) { seosales = 'SEO_SOGOU'; }
                if (refUrl.indexOf('m.so.com') > -1) { seosales = 'SEO_SO'; }
                if (refUrl.indexOf('so.360') > -1) { seosales = 'SEO_360SO'; }
                if (refUrl.indexOf('bing.com') > -1) { seosales = 'SEO_BING'; }
                if (refUrl.indexOf('yahoo') > -1) { seosales = 'SEO_YAHOO'; }
                if (refUrl.indexOf('youdao') > -1) { seosales = 'SEO_YOUDAO'; }
                if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) { seosales = 'SEO_360SO'; }

            }
            var appSourceid = window.localStorage.getItem('SOURCEID');

            var _sales = CommonStore.SalesStore.getInstance().get();
            var sales = this.getQuery('sales') || seosales || (_sales && _sales.sales),
                sourceid = this.getQuery('sourceid') || appSourceid || (_sales && _sales.sourceid);

            if (sales || sourceid) {
                if (sales) {
                    cSales.setSales(sales);
                }
                if (sourceid) {
                    cSales.setSourceId(sourceid);
                }
                cSales.getSalesObject(sales || sourceid, $.proxy(function (data) {
                    cSales.replaceContent($el);
                }, this));
            } else {
                if (local && refUrl.indexOf(local) === -1) {
                    refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
                    if (refUrl.indexOf('baidu') > -1) { sales = 'SEO_BAIDU'; }
                    if (refUrl.indexOf('google') > -1) { sales = 'SEO_GOOGLE'; }
                    if (refUrl.indexOf('soso.com') > -1) { sales = 'SEO_SOSO'; }
                    if (refUrl.indexOf('sogou') > -1) { sales = 'SEO_SOGOU'; }
                    if (refUrl.indexOf('m.so.com') > -1) { sales = 'SEO_SO'; }
                    if (refUrl.indexOf('so.360') > -1) { sales = 'SEO_360SO'; }
                    if (refUrl.indexOf('bing.com') > -1) { sales = 'SEO_BING'; }
                    if (refUrl.indexOf('yahoo') > -1) { sales = 'SEO_YAHOO'; }
                    if (refUrl.indexOf('youdao') > -1) { sales = 'SEO_YOUDAO'; }
                    if (sales) cSales.setSales(sales);
                    setTimeout(function () { cSales.replaceContent($el); }, 1);
                }
            }
        },
        getServerDate: function (callback) {
            return cUtility.getServerDate(callback);
        },
        now: function () {
            return cUtility.getServerDate();
        },
        debug: function () {
            var debug = this.request.query['debug'] || localStorage.get('DEBUG');
            if (debug == 'yes') {
                $(window).unbind('error', debughander);
                $(window).bind('error', debughander);
                localStorage.set('DEBUG', debug, new cBase.Date(cBase.getServerDate()).addDay(1).valueOf());
            } else if (debug == 'no') {
                $(window).unbind('error', debughander);
                localStorage.remove('DEBUG');
            }
        },

        _sendUbt: function () {
            if (window.$_bf && window.$_bf.loaded == true) {
                var url = this._getAurl(),
                    query = this.request.query,
                    pId = $('#page_id'),
                    oId = $('#bf_ubt_orderid');
                var pageId = +(this.pageid) ;
                if (cUtility.isInApp()) {
                  pageId += 1000;
                }
                if (pId.length == 1) {
                    pId.val(pageId);
                }
                //set order id
                if (oId.length == 1) {
                    if (query && query.orderid) {
                        oId.val(query.orderid);
                    } else {
                        oId.val('');
                    }
                }
                window.$_bf['asynRefresh']({
                    page_id: pageId,
                    url: location.protocol + "//" + location.host + url
                });
            } else {
                setTimeout($.proxy(this._sendUbt, this), 300);
            }
        },

        _sendGa: function () {
            //ga统计
            if (typeof _gaq !== 'undefined') {
                var url = this._getAurl();
                _gaq.push(['_trackPageview', url]);
            } else {
                setTimeout($.proxy(this._sendGa, this), 300);
            }
        },

        _sendKenshoo: function () {
            var query = this.request.query;
            if (query && query.orderid) {
                var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
                kurl += "&val=" + query.val + "&orderId=" + query.orderid + "&type=" + query.type;
                var imgHtml = "<img width='1' height='1' src='" + kurl + "'/>"
                $('body').append(imgHtml);
            }
        },

        _getAurl: function () {
            var url = this.request.root, param;
            if (this.request.viewpath) {
                url += "#" + this.request.viewpath;
            }
            if (this.request.path.length > 0) {
                param = $.param(this.request.query);
                url += "!" + this.request.path.join("/") + (param.length ? '?' + param : '');
            }
            return url;
        },

        //处理渠道
        disposeChannel: function () {
            var AllianceID = this.getQuery('allianceid'),
                SID = this.getQuery('sid'),
                OUID = this.getQuery('ouid');
            var UNION;
            if (AllianceID && SID) {
                UNION = {
                    AllianceID: AllianceID,
                    SID: SID,
                    OUID: OUID
                };
                CommonStore.UnionStore.getInstance().set(UNION);
            }
        },
        //获得guid
        getGuid: function () {
            return cUtility.getGuid();
        }
    });
});
