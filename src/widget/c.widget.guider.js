/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  组件Guider
 * @see: http://git.dev.sh.ctripcorp.com/cmli/ctrip-h5-document/blob/master/widget/t.widget.guider.md
 *
 */
define(['cUtility', 'cWidgetFactory', 'cHybridFacade'], function (Util, WidgetFactory, Facade) {
    "use strict";

    var WIDGET_NAME = 'Guider';

    var HybridGuider = {
        jump: function (options) {
            var model = {
                refresh: function () {
                    Facade.request({ name: Facade.METHOD_OPEN_URL, targetMode: 0, title: options.title });
                },
                app: function () {
                    if (options && options.module) {
                        var openUrl = Facade.getOpenUrl(options);
                        Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: openUrl, targetMode: 1, title: options.title });
                    } else if (options && options.url) {
                        Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 1, title: options.title });
                    };
                },
                h5: function () {
                    if (options && options.url) {
                        Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 2, title: options.title });
                    }
                },
                browser: function () {
                    if (options && options.url) {
                        Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 3, title: options.title });
                    }
                }
            }

            if (typeof model[options.targetModel] === 'function') {
                model[options.targetModel]();
            }
        },

        apply: function (options) {
            options.hybridCallback();
        },

        call: function (options) {
            return false;
        },

        init: function (options) {
            if (options && window.parseFloat(options.version) < 5.2) {
                Facade.request({ name: Facade.METHOD_ENTRY, callback: options.callback });
            } else {
                Facade.request({ name: Facade.METHOD_INIT, callback: options.callback });
            }
        },

        log: function (options) {
            Facade.request({ name: Facade.METHOD_LOG_EVENT, event_name: options.name })
        },

        print: function (options) {
          Facade.request({ name: Facade.METHOD_NATIVE_LOG, log: options.log, result: options.result });
        },

        callService: function () {
            Facade.request({ name: Facade.METHOD_CALL_SERVICE_CENTER });
        },

        backToLastPage: function (options) {
            var param = options ? options.param : '';
            Facade.request({ name: Facade.METHOD_BACK_TO_LAST_PAGE, param: param });
        },

        checkUpdate: function () {
            Facade.request({ name: Facade.METHOD_CHECK_UPDATE });
        },

        recommend: function () {
            Facade.request({ name: Facade.METHOD_RECOMMEND_APP_TO_FRIEND });
        },

        addWeixinFriend: function () {
            Facade.request({ name: Facade.METHOD_ADD_WEIXIN_FRIEND });
        },

        showNewestIntroduction: function () {
            Facade.request({ name: Facade.METHOD_SHOW_NEWEST_INTRODUCTION });
        },

        register: function (options) {
            if (options && options.tagname && options.callback) {
                Facade.register({ tagname: options.tagname, callback: options.callback });
            }
        },

        create: function () {
            Facade.init();
        },

        home: function () {
            Facade.request({ name: Facade.METHOD_BACK_TO_HOME });
        },

        jumpHotel: function (options) {
            Facade.request({ name: Facade.METHOD_GO_TO_HOTEL_DETAIL, hotelId: options.hotelId, hotelName: options.name, cityId: options.cityId, isOverSea: options.isOverSea })
        },

        injectUbt: function () {
            var content = '!function () { var a, b, c, d, e, f, g, i; if (true) { for (a = document.getElementsByTagName("script") || [],' +
        ' b = /_bfa\.min\.js/i, c = 0; c < a.length; c++) if (b.test(a[c].src)) return; if (!(window.$_bf || window.$LAB || window.CtripJsLoader))' +
        ' { d = new Date, e = "?v=" + d.getFullYear() + d.getMonth() + "_" + d.getDate() + ".js", f = document.createElement("script"),' +
        ' f.type = "text/javascript", f.charset = "utf-8", f.async = !0; try { g = "https:" == document.location.protocol } catch (h) ' +
        '{ g = "https:" == document.URL.match(/[^:]+/) + ":" } f.src = g ? "https://s.c-ctrip.com/_bfa.min.js" + e : "http://webresource.c-ctrip.com' +
        '/code/ubt/_bfa.min.js" + e, i = document.getElementsByTagName("script")[0], i.parentNode.insertBefore(f, i) } } } ();';

            var s = $('<script>' + content + '//<' + '\/scrtip>');
            $('body').append(s);
        },

        checkAppInstall: function (options) {
            Facade.request({ name: Facade.METHOD_CHECK_APP_INSTALL, url: options.url, package: options.package, callback: options.callback });
        },

        callPhone: function (options) {
            Facade.request({ name: Facade.METHOD_CALL_PHONE, tel: options.tel });
        },

        cross: function (options) {
            Facade.request({ name: Facade.METHOD_CROSS_JUMP, param: options.param, path: options.path });
        },

        refreshNative: function (options) {
            Facade.request({ name: Facade.METHOD_REFRESH_NATIVE, package: options.package, json: options.json });
        },

        copyToClipboard: function (options) {
            Facade.request({ name: Facade.METHOD_COPY_TO_CLIPBOARD, content: options.content });
        },

        readFromClipboard: function (options) {
            Facade.request({ name: Facade.METHOD_READ_FROM_CLIPBOARD, callback: options.callback });
        },

        shareToVendor: function (options) {
            Facade.request({ name: Facade.METHOD_SHARE_TO_VENDOR, imgUrl: options.imgUrl, text: options.text });
        },

        downloadData: function (options) {
            Facade.request({ name: Facade.METHOD_DOWNLOAD_DATA, url: options.url, callback: options.callback, suffix: options.suffix });
        }
    };

    var Guider = {
        jump: function (options) {
            if (options && options.url && typeof options.url === 'string') {
                window.location.href = options.url;
            }
        },

        apply: function (options) {
            if (options && options.callback && typeof options.callback === 'function') {
                options.callback();
            }
        },

        call: function (options) {
            var $caller = document.getElementById('h5-hybrid-caller');

            if (!options || !options.url || !typeof options.url === 'string') {
                return false;
            } else if ($caller && $caller.src == options.url) {
                $caller.contentDocument.location.reload();
            } else if ($caller && $caller.src != options.url) {
                $caller.src = options.url;
            } else {
                $caller = document.createElement('iframe');
                $caller.id = 'h5-hybrid-caller';
                $caller.src = options.url;
                $caller.style.display = 'none';
                document.body.appendChild($caller);
            }
        },

        init: function () {
            return false;
        },

        log: function (options) {
            if (window.console) {
                window.console.log(options.name);
            }
        },

        print: function(options){
          return console.log(options.log, options.result);
        },

        callService: function () {
            window.location.href = 'tel:4000086666';
        },

        backToLastPage: function () {
            window.location.href = document.referrer;
        },

        checkUpdate: function () {
            return false;
        },

        recommend: function () {
            return false;
        },

        addWeixinFriend: function () {
            return false;
        },

        showNewestIntroduction: function () {
            return false;
        },

        register: function () {
            return false;
        },

        create: function () {
            return false;
        },

        home: function () {
            window.location.href = '/';
        },

        jumpHotel: function () {
            return false;
        },

        injectUbt: function () {
            return false;
        },

        checkAppInstall: function () {
            return false;
        },

        callPhone: function () {
            return false;
        },

        cross: function () {
            return false;
        },

        refreshNative: function () {
            return false;
        },

        copyToClipboard: function (options) {
            return false;
        },

        readFromClipboard: function (options) {
            return false;
        },

        shareToVendor: function (options) {
            return false;
        },

        downloadData: function (options) {
            return false;
        }
    };

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: Util.isInApp() ? HybridGuider : Guider
    });
});
