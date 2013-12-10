/**
 * 广告组件
 * @type {adOptions|*|{}}
 */

/**
* 判断手机是否安装app
* l_wang
*/
(function () {
    var AppUtility = {
        t: 1500,
        hasApp: true,
        key: 'HAS_CTRIP_APP',
        appProtocol: 'ctrip://wireless',
        //传入参数，第一个是有app时候处理方案，第二个是没有app时候处理方案，有点情况函数返回ture才打开app，但是初次无论如何都会打开
        openApp: function (hasAppFunc, noAppFunc) {
            //看是否已经获取了数据，已经获取过数据便有其它方案
            var appData = AppUtility.getAppData();

            if (appData != '') {
                if (appData.hasApp) {
                    if (typeof hasAppFunc == 'function') {
                        if (hasAppFunc()) window.location = AppUtility.appProtocol;
                    } else {
                        window.location = AppUtility.appProtocol;
                    }
                } else {
                    (typeof noAppFunc == 'function') && noAppFunc();
                }
                return '';
            }

            var t1 = Date.now();
            var ifr = $('<iframe style="display: none;"></iframe>')
            ifr.attr('src', AppUtility.appProtocol);
            $('body').append(ifr);
            setTimeout(function () {
                AppUtility.testApp(t1);
            }, AppUtility.t);
            AppUtility.setTestResult(hasAppFunc, noAppFunc);
        },
        testApp: function (t1) {
            var t2 = Date.now();
//            log('t: ' + (AppUtility.t + 200) + '_t2-t1: ' + (t2 - t1));
            if (!t1 || t2 - t1 < AppUtility.t + 200) {
                AppUtility.hasApp = false;
            }
        },
        //设置探测结果
        setTestResult: function (hasAppFunc, noAppFunc) {

            setTimeout(function () {
//                log(AppUtility.hasApp);

                if (AppUtility.hasApp) {
                    (typeof hasAppFunc == 'function') && hasAppFunc();
                } else {
                    (typeof noAppFunc == 'function') && noAppFunc()
                }

                //一小时过期
                var expireDate = new Date();
                expireDate.setHours(expireDate.getHours() + 1);
                var entity = {
                    value: { hasApp: AppUtility.hasApp },
                    timeout: expireDate.toUTCString()
                };
                window.localStorage.setItem(AppUtility.key, JSON.stringify(entity));
                window.hasApp = AppUtility.hasApp;

            }, AppUtility.t + 1000);
        },
        //获取app信息
        getAppData: function () {
            //暂时不缓存数据
            return '';

            var result = window.localStorage.getItem(AppUtility.key);
            var needReset = false; //是否需要重新设置数据，1 过期则需要, 2 没数据需要
            if (result) {
                result = JSON.parse(result);
                if (Date.parse(result.timeout) >= new Date()) {
                    return result.value;
                }
            }
            return '';
        }
    };
    window.AppUtility = AppUtility;
})();


var adOptions = adOptions || {};

adOptions.__propertys__ = function () {
};

/********************************
 * @description: AdView初始化，主要是配置rootBox、绑定按钮事件
 */
adOptions.initialize = function ($super, config) {
    this.data = config || {};
    this.storeKey = 'APP_DOWNLOAD';
    $super(config);
};

adOptions.update = function (config) {
    if(this.isInFooter){
        this.remove();
        this.isCreate = false;
    }
    this.rootBox = config.rootBox;
    if (!this.root) {
        this.root = this.rootBox;
    }
    this.isInFooter = !!this.rootBox.hasClass('js_in_Footer');

    if (this.addEvent) {
        this.removeEvent('onShow');
        this.addEvent('onShow', this.onShow);
    }
};
/********************************
 * @description: 通过模板和开发者传入的数据生成HeaderView
 */
adOptions.createHtml = function () {
    var clazz = this.isInFooter ? '' : 'fix_bottom';
    var url = '/market/download.aspx?from=H5';
    var s = adOptions._get("SALES_OBJECT");
    if (s && s.sid && +s.sid > 0) {
        url = s.appurl ? s.appurl : 'http://m.ctrip.com/market/download.aspx?from=' + s.sid;
    }
  return ['<div id="dl_app" class="', clazz,
    '"> <div id="icon_text" class="txt_middle"><img src="http://res.m.ctrip.com/html5/content/images/icon_text_s6.png"/></div>',
    ' <a href="' + url + '" id="app_link" class="txt_middle __appaddress__"><img src="http://res.m.ctrip.com/html5/content/images/icon_open_s6.png"/></a>',
    '<div id="close_icon"></div>',
    '</div>'].join('');
};

/********************************
 * @description: onShow时候的回调，绑定Adview上的事件
 */
adOptions.onShow = function () {
    this.root.off('click');
    this.root.find('#close_icon').on('click', $.proxy(function () {
        this.saveExpire();
        this.hide();
    }, this));

  var scope = this;
    //修改点击逻辑l_wang
    this.root.find('#app_link').on('click', function (e) {
        var url = $(this).attr('href');
        AppUtility.openApp(function () {
          scope.saveExpire();
          scope.hide();
            return true;
        }, function () {
            //            log(url);
            window.location = url;
        });
        e.preventDefault();
        return false;
    })

    if (this.checkDeviceSupport() == false) {
        this.hide();
    }
};

//l_wang测试是否android ios，不是就得关闭
adOptions.checkDeviceSupport = function () {
    var isMac = (navigator.userAgent.indexOf("Mac", 0) != -1) ? 1 : 0;
    var isAndroid = (navigator.userAgent.indexOf("android", 0) != -1) ? 1 : 0;
    if (isAndroid == 0) isAndroid = (navigator.userAgent.indexOf("Android", 0) != -1) ? 1 : 0;
    if (isMac == 0 && isAndroid == 0) {
        return false;
    }
    return true;
};


/**
 * 保存失效时间
 */
adOptions.saveExpire = function () {
    var data = {isExpire: 1},
        timeout = new Date();
    timeout.setDate(timeout.getDate() + 1);
    this._set(this.storeKey, data, timeout.toUTCString());
};


/********************************
 * @description: 重写create方法
 */
adOptions.create = function () {
    
    if (!this.isCreate && !this.isExpire() && this.status !== this.STATE_ONCREATE) {
        this.root = $(this.createHtml());
        this.rootBox.append(this.root);
        this.trigger('onCreate');
        this.isCreate = true;
    }
};

//验证是否过期
adOptions.isExpire = function () {
    var data = this._get(this.storeKey);
    return !!data;
};

adOptions._get = function (key) {
    var result = window.localStorage.getItem(key);
    if (result) {
        result = JSON.parse(result);
        if (Date.parse(result.timeout) >= new Date()) {
            return result.value;
        }
    }
    return ""
},
adOptions._set = function (key, value, timeout) {
    var entity = {
        value: value,
        timeout: timeout
    };
    window.localStorage.setItem(key, JSON.stringify(entity));
}

if (window.location.pathname.indexOf('webapp')>-1 || window.localStorage.getItem('isInApp') ) {
    define(['cBase', 'cUICore', 'libs', 'cStore'], function (cBase, cUICore, libs, cStore) {
        var AdView = new cBase.Class(cUICore.AbstractView, adOptions);
        AdView.getInstance = function () {
            if (this.instance) {
                return this.instance;
            } else {
                return this.instance = new this();
            }
        };
        return AdView;
    });
} else {
    adOptions.show = function () {
        this.status = '';
        this.create();
        this.onShow();
    };
    adOptions.hide = function () {
        this.root.hide();
    }
    adOptions.trigger = function () {
    };

    var config = {
        rootBox: $('#footer')
    };
    adOptions.initialize(function () {
    }, config);
    var AdView = adOptions;
    AdView.update(config);
    AdView.show();
}
