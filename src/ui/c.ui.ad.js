/**
* @author zsb张淑滨 <shbzhang@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUIAdView
* @description 广告组件 / 判断手机是否安装app
*/
(function () {
  var AppUtility = {
    /** app响应延迟点 */
    t: 1500,
    /** 是否安装app */
    hasApp: true,
    /** localstorage键值 */
    key: 'HAS_CTRIP_APP',
    appProtocol: 'ctrip://wireless',
    /**
    * @method openApp
    * @param {function} hasAppFunc 有app执行的回调
    * @param {function} noAppFunc  没有app执行的回调
    * @param {function} appUrl  appurl
    */
    openApp: function (hasAppFunc, noAppFunc, appUrl) {
      //看是否已经获取了数据，已经获取过数据便有其它方案
      var appData = AppUtility.getAppData();

      if (appData && appData != '') {
        if (appData.hasApp) {
          if (typeof hasAppFunc == 'function') {
            if (hasAppFunc()) window.location = appUrl;
          } else {
            window.location = appUrl;
          }
        } else {
          (typeof noAppFunc == 'function') && noAppFunc();
        }
        return '';
      }

      //当前事件戳
      var t1 = Date.now();
      //iframe框架，以它打开app
      var ifr = $('<iframe style="display: none;"></iframe>')
      ifr.attr('src', appUrl);
      $('body').append(ifr);

      var u = navigator.userAgent ? navigator.userAgent.toLocaleLowerCase() : '';
      var isAndroid = (u.indexOf("android", 0) != -1) || (u.indexOf("adr", 0) != -1) ? 1 : 0, isChrome = isAndroid && u.indexOf("chrome", 0) != -1;
      //这里需要判断是不是android下的chrome，如果是的话就使用以下逻辑
      //如果不是便使用原来的逻辑        
      if (isChrome) {
        setTimeout(function () {
          (typeof noAppFunc == 'function') && noAppFunc();
        }, 1);
        window.location.href = appUrl;
      } else {
        setTimeout(function () {
          AppUtility.testApp(t1);
        }, AppUtility.t);
      }
      AppUtility.setTestResult(hasAppFunc, noAppFunc);
    },
    /**
    * @method testApp
    * @param {String} t1 时间戳
    */
    testApp: function (t1) {
      var t2 = Date.now();
      if (!t1 || t2 - t1 < AppUtility.t + 200) {
        AppUtility.hasApp = false;
      }
    },
    /**
    * @method setTestResult
    * @param {String} t1 时间戳
    * @param {function} hasAppFunc 有app执行的回调
    * @param {function} noAppFunc  没有app执行的回调
    * @description 设置探测结果
    */
    setTestResult: function (hasAppFunc, noAppFunc) {
      setTimeout(function () {
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

/**
* @method initialize
* @param $super {function}      父构造函数
* @param config {object}        构造函数（实例化）传入的参数
* @description AdView初始化，主要是配置rootBox、绑定按钮事件
*/
adOptions.initialize = function ($super, config) {
  this.data = config || {};
  this.storeKey = 'APP_DOWNLOAD';
  $super(config);
};

/**
* @method update
* @param config {object}        构造函数（实例化）传入的参数
* @description 更新信息
*/
adOptions.update = function (config) {
  if (this.isInFooter) {
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

/**
* @method createHtml
* @description 通过模板和开发者传入的数据生成HeaderView
*/
adOptions.createHtml = function () {
  var ss1 = adOptions.getUrlParam('sourceid'), ss2 = adOptions.getUrlParam('sales'), allianceid = adOptions.getUrlParam('allianceid'), sid = adOptions.getUrlParam('sid');
  var clazz = this.isInFooter ? '' : 'fix_bottom';
  var url = '/market/download.aspx?from=H5';
  var s = adOptions._get("SALES_OBJECT"), unionInfo = adOptions._get("UNION"), unionCookie = adOptions._getCookie('UNION');
  var sCss = '';
  if (allianceid && allianceid.length > 0 && sid && sid.length > 0) {
    sCss = 'display:none;';
  }
  if (unionInfo || unionCookie) { sCss = 'display:none;'; }
  if (s && s.sid && +s.sid > 0) {
    if (!s.appurl || s.appurl.length <= 0) {
      sCss = 'display:none;';
    }
    url = s.appurl ? s.appurl : '/market/download.aspx?from=' + s.sid;
  }
  /*判断是否强制下载渠道*/
  if (ss1 && ss1.length > 0) {
    var isForceDown = 0;
    var lstSourceid = ['497', '1107', '1108', '3516', '3512', '3511', '3503', '3513', '1595', '1596', '3524', '3517', '3518', '1591', '1825', '1826', '1827', '1828', '1829', '1830', '1831'];
    for (var i = 0, len = lstSourceid.length; i < len; i++) {
      var d = lstSourceid[i];
      if (d == ss1) { isForceDown = 1; break; }
    }
    if (isForceDown) { sCss = ''; }
  }
  if (this.checkDeviceSupport() == false) { sCss = 'display:none;'; }
  if (sCss.length > 0) {
    if ($('footer')) $('footer').removeClass('pb85');
    if ($('div[data-role="footer"]')) $('div[data-role="footer"]').removeClass('pb85');
    if ($('#panel-box')) { $('#panel-box').removeClass('pb85'); }
    adOptions.saveExpire();
    return '';
  }
  return ['<div id="dl_app" style="' + sCss + '" class="', clazz,
    '"> <div id="icon_text" class="txt_middle"><img src="http://res.m.ctrip.com/html5/content/images/icon_text_s6.png"/></div>',
    ' <a href="' + url + '" id="app_link" class="txt_middle __appaddress__"><img src="http://res.m.ctrip.com/html5/content/images/icon_open_s6.png"/></a>',
    '<div id="close_icon"></div>',
    '</div>'].join('');
};

/**
* @method getUrlParam
* @description 获取url参数
*/
adOptions.getUrlParam = function (name) {
  //var aParams = document.location.search.substr(1).split('&');
  var urls = document.location.href || '', re = new RegExp("(\\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = urls.match(re);
  if (m) return m[2];
  return '';
},

/**
* @method setAppUrl
* @description 设置appurl（业务代码）
*/
adOptions.setAppUrl = function () {
  //获取渠道信息
  var sourceInfo = adOptions._get("SALES_OBJECT");
  var appUrl = AppUtility.appProtocol;
  var bizName = null, searchInfo = null, c1 = null, c2 = null, c3 = null, c4 = null, c5 = null, c6 = null, c7 = null, c8 = null, c9 = null, c10 = null, c11 = null;
  var pageId = $('#page_id').val();
  var _reg = new RegExp("-", "g"), _reg2 = new RegExp("/", "g"); //创建正则RegExp对象
  if (pageId && +pageId > 0) {
    if (+pageId == 212092 || +pageId == 212093 || +pageId == 212094) {
      //国内常规酒店搜索/列表/详情页
      bizName = +pageId == 212092 ? 'hotel_inquire' : +pageId == 212093 ? "hotel_inland_list" : +pageId == 212094 ? "InlandHotel" : "";
      searchInfo = window.localStorage ? window.localStorage.getItem("HOTELSEARCHINFO") : null;
      if (searchInfo) {
        searchInfo = JSON.parse(searchInfo);
        if (+pageId == 212092) {
          //国内常规酒店搜索
          if (searchInfo.data) {
            c1 = searchInfo.data.CheckInDate.replace(_reg, ''); //入住时间（必需，格式YYYYMMDD）
            c2 = searchInfo.data.CheckOutDate.replace(_reg, ''); //离店时间（必需，格式YYYYMMDD）
            c3 = searchInfo.data.CheckInCityID; //酒店城市ID(必需)
            c4 = searchInfo.data.DistrictId ? +searchInfo.data.DistrictId <= 0 ? "" : searchInfo.data.DistrictId : ""; //景区ID (可选)
            c5 = searchInfo.data.BrandId; //品牌ID (可选)
            c6 = searchInfo.data.BrandName; //品牌名称 (可选)
            c7 = 0; //品牌类型(可选，0：全部品牌，1：经济型连锁品牌，默认0)
          }
          bizName += '?c1=' + (c1 || '') + "&c2=" + (c2 || '') + "&c3=" + (c3 || '') + "&c4=" + (c4 || '') + "&c5=" + (c5 || '') + "&c6=" + (c6 || '') + "&c7=" + (c7 || '');
        }
        if (+pageId == 212093) {
          //国内常规酒店列表
          if (searchInfo.data) {
            c1 = searchInfo.data.CheckInDate.replace(_reg, ''); //入住时间（必需，格式YYYYMMDD）
            c2 = searchInfo.data.CheckOutDate.replace(_reg, ''); //离店时间（必需，格式YYYYMMDD）
            c3 = searchInfo.data.CheckInCityID; //酒店城市ID(必需)
            c4 = searchInfo.data.DistrictId ? +searchInfo.data.DistrictId <= 0 ? "" : searchInfo.data.DistrictId : ""; //景区ID (可选)
            c5 = 0; //酒店类型(0：国内，1：海外) (预留，目前没有海外)
            c6 = searchInfo.data.BrandId ? +searchInfo.data.BrandId <= 0 ? "" : searchInfo.data.BrandId : ""; //品牌ID (可选)
            c7 = searchInfo.data.BrandName || '';  //品牌名称 (可选)
            c8 = 0; //品牌类型(可选，0：全部品牌，1：经济型连锁品牌，默认0)
          }
          bizName += '?c1=' + (c1 || '') + "&c2=" + (c2 || '') + "&c3=" + (c3 || '') + "&c4=" + (c4 || '') + "&c5=" + (c5 || '') + "&c6=" + (c6 || '') + "&c7=" + (c7 || '');
        }
        if (+pageId == 212094) {
          //国内常规酒店详情页
          if (searchInfo.data) {
            c1 = searchInfo.data.CheckInDate.replace(_reg, ''); //入住时间（必需，格式YYYYMMDD）
            c2 = searchInfo.data.CheckOutDate.replace(_reg, ''); //离店时间（必需，格式YYYYMMDD）
            c3 = searchInfo.data.CheckInCityID; //酒店城市ID(必需)

          }
          var detailInfo = window.localStorage ? window.localStorage.getItem("HOTELDETAIL") : null;
          if (detailInfo) {
            detailInfo = JSON.parse(detailInfo);
            if (detailInfo && detailInfo.data) {
              c4 = detailInfo.data.HotelID; //酒店ID(必需)
            }
          }
          bizName += '?checkInDate=' + (c1 || '') + "&checkOutDate=" + (c2 || '') + "&cityId=" + (c3 || '') + "&hotelId=" + (c4 || '');
        }
      }
    }
    if (+pageId == 212001 || +pageId == 214008) {
      //团购列表/详情页
      bizName = +pageId == 212001 ? 'hotel_groupon_list' : +pageId == 214008 ? "hotel_groupon_detail" : "";
      if (+pageId == 212001) {
        //团购列表
        searchInfo = window.localStorage ? window.localStorage.getItem("TUAN_SEARCH") : null;
        searchInfo = searchInfo ? JSON.parse(searchInfo) : null;
        c1 = searchInfo && searchInfo.value ? searchInfo.value.ctyId : "2";
        bizName += '?c1=' + (c1 || '2');
      }
      if (+pageId == 214008) {
        //团购详情
        searchInfo = window.localStorage ? window.localStorage.getItem("TUAN_DETAILS") : null;
        searchInfo = searchInfo ? JSON.parse(searchInfo) : null;
        c1 = searchInfo && searchInfo.value ? searchInfo.value.id : null; //产品ID（必需）
        bizName += '?c1=' + (c1 || '');
      }
    }
    if (+pageId == 212003 || +pageId == 212004 || +pageId == 212009 || +pageId == 214019) {
      //机票搜索/列表页
      searchInfo = window.localStorage ? window.localStorage.getItem("FLIGHT_SEARCH") : null;
      searchInfo = searchInfo ? JSON.parse(searchInfo) : null;
      if (searchInfo && searchInfo.value && searchInfo.value._items && searchInfo.value._items.length > 0) {
        c1 = searchInfo.value.tripType; //单程/往返(1/2)（必需）
        c2 = searchInfo.value._items[0].dCtyId; //出发城市id （必需）
        c3 = searchInfo.value._items[0].aCtyId; //到达城市id（必需）
        c4 = searchInfo.value._items[0].date.replace(_reg2, ''); //出发时间（yyyymmdd）（必需）
        if (c1 && +c1 > 1 && searchInfo.value._items.length > 1) {
          c5 = searchInfo.value._items[1].date.replace(_reg2, ''); //出发时间（yyyymmdd）（必需）
        }
        c6 = ''; //筛选舱位（可选）1：经济舱  5：公务/头等舱
        c7 = ''; //排序类型（预留）1:起飞时间升序 2:起飞时间降序 3:价格升序 4：价格降序
        c8 = ''; //筛选出发/到达（预留）格式：departFilterAirportCode|arriveFilterAirportCode 通过竖线区分筛选的是出发还是到达机场
        c9 = ''; //筛选起飞时间（预留）格式：0600|1200
        c10 = ''; //筛选机型（预留）1大型机 2 中型机 3 小型机
        c11 = ''; //筛选航司（预留）航空公司二字码
      }
      if (+pageId == 212003) {
        //机票搜索
        bizName = 'flight_inquire';
      }
      if (+pageId == 212009 || +pageId == 212004) {
        //国内机票列表页
        bizName = c1 && +c1 > 1 ? 'flight_inland_tolist' : "flight_inland_singlelist";
      }
      if (+pageId == 214019) {
        //国际机票列表页
        bizName = c1 && +c1 > 1 ? 'flight_int_tolist' : "flight_int_singlelist";
      }
      bizName += '?c1=' + (c1 || '') + "&c2=" + (c2 || '') + "&c3=" + (c3 || '') + "&c4=" + (c4 || '') + "&c5=" + (c5 || '') + "&c6=" + (c6 || '') + "&c7=" + (c7 || '') + "&c8=" + (c8 || '') + "&c9=" + (c9 || '') + "&c10=" + (c10 || '') + "&c11=" + (c11 || '');
    }
  }
  appUrl += bizName ? "/" + bizName : '';
  if (appUrl.indexOf('?') <= -1) {
    appUrl += '?v=2';
  }
  if (sourceInfo && sourceInfo.sid && +sourceInfo.sid > 0) {
    appUrl += '&extendSourceID=' + sourceInfo.sid;
  } else {
    appUrl += '&extendSourceID=8888';
  }
  return appUrl;
};

/**
* @method onShow
* @description onShow时候的回调，绑定Adview上的事件
*/
adOptions.onShow = function () {
  this.root.off('click');
  this.root.find('#close_icon').on('click', $.proxy(function () {
    this.saveExpire();
    this.hide();
    if ($('footer')) {
      $('footer').removeClass('pb85');
    }
    if ($('#panel-box')) {
      $('#panel-box').removeClass('pb85');
    }
    if ($('div[data-role="footer"]')) {
      $('div[data-role="footer"]').removeClass('pb85');
    }
  }, this));

  var scope = this;
  //修改点击逻辑l_wang
  this.root.find('#app_link').on('click', function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var appUrl = adOptions.setAppUrl();
    AppUtility.openApp(function () {
      scope.saveExpire();
      scope.hide();
      return true;
    }, function () {
      window.location = url;
    }, appUrl);
    return false;
  });

  if (this.checkDeviceSupport() == false) {
    //this.hide();
    //fix pc 浏览器访问,导致团购酒店入口消失的问题 shbzhang 2014/1/6
    if (this.root.attr('id') == 'dl_app') {
      this.root.hide();
    }
    if ($('footer')) $('footer').removeClass('pb85');
    if ($('div[data-role="footer"]')) $('div[data-role="footer"]').removeClass('pb85');
    if ($('#panel-box')) { $('#panel-box').removeClass('pb85'); }
  }
};

/**
* @method checkDeviceSupport
* @description 测试是否android ios，不是就得关闭
*/
adOptions.checkDeviceSupport = function () {
  var u = navigator.userAgent ? navigator.userAgent.toLocaleLowerCase() : '';
  var isMac = (u.indexOf("mac", 0) != -1) || (navigator.userAgent.indexOf("ios", 0) != -1) ? 1 : 0;
  var isAndroid = (u.indexOf("android", 0) != -1) || (u.indexOf("adr", 0) != -1) ? 1 : 0;
  if (isMac == 0 && isAndroid == 0) {
    return false;
  }
  return true;
};

/**
* @method saveExpire
* @description 保存失效时间
*/
adOptions.saveExpire = function () {
  var data = { isExpire: 1 }, timeout = new Date();
  timeout.setDate(timeout.getDate() + 1);
  if (!this.storeKey) {
    this.storeKey = "APP_DOWNLOAD";
  }
  this._set(this.storeKey, data, timeout.toUTCString());
};

/**
* @method checkForceDownload
* @description 强制下载
*/
adOptions.checkForceDownload = function (sourceid) {
  var self = this;
  if (!sourceid || sourceid.length <= 0 || +sourceid <= 0) return;
  //获取渠道信息
  var s = adOptions._get("SALES_OBJECT");
  var appUrl = AppUtility.appProtocol;
  if (s && s.sid && +s.sid > 0) {
    appUrl += '?extendSourceID=' + s.sid;
  } else {
    appUrl += '?extendSourceID=8888';
  }
  //传入处理函数，第一个是有app时候处理方案，第二个是没有app时候处理方案
  //安装app情况下，第一个参数为true才会打开app，但是初次无论如何都会打开
  AppUtility.openApp(function () {
    adOptions.saveExpire();
    self.hide();
    return true;
  }, function () {
    var u = navigator.userAgent ? navigator.userAgent.toLocaleLowerCase() : '';
    var isAndroid = (u.indexOf("android", 0) != -1) || (u.indexOf("adr", 0) != -1) ? 1 : 0;
    //Android强制下载
    if (isAndroid) {
      var url = "http://m.ctrip.com/market/download.aspx?from=" + sourceid + '&App=3';
      if (s && s.sid && +s.sid > 0 && +s.sid == +sourceid && s.appurl && s.appurl.length > 0) {
        url = s.appurl;
      }
      adOptions.saveExpire();
      self.hide();
      window.location.href = url;
    }
  }, appUrl);
};

/**
* @method create
* @description 重写create方法
*/
adOptions.create = function () {
  if (!this.isCreate && !this.isExpire() && this.status !== this.STATE_ONCREATE) {
    //如果返回的是空字符，则不生成浮层 2014-1-4 caof
    var s = this.createHtml();
    if (s && s.length > 0) {
      this.root = $(this.createHtml());
      this.rootBox.append(this.root);
      this.trigger('onCreate');
    }
    this.isCreate = true;
  } else {
    if ($('footer')) {
      $('footer').removeClass('pb85');
    }
    if ($('#panel-box')) {
      $('#panel-box').removeClass('pb85');
    }
    if ($('div[data-role="footer"]')) {
      $('div[data-role="footer"]').removeClass('pb85');
    }
  }
};

/**
* @method isExpire
* @description 验证是否过期
*/
adOptions.isExpire = function () {
  var data = this._get(this.storeKey);
  return !!data;
};

/**
* @method _getCookie
* @param name {String}       键值
* @description 获取cookie信息
*/
adOptions._getCookie = function (name) {
  var result = null;
  if (name) {
    var RegCookie = new RegExp('\\b' + name + '=([^;]*)\\b'), match = RegCookie.exec(document.cookie);
    result = match && unescape(match[1])
  } else {
    var cookies = document.cookie.split(';'), i, c; result = {};
    for (i = 0, len = cookies.length; i < len; i++) {
      c = cookies[i].split('='); result[c[0]] = unescape(c[2])
    }
  }
  return result;
};

/**
* @method _get
* @param key {String}       键值
* @description 根据key获取localstorage信息
*/
adOptions._get = function (key) {
  var result = window.localStorage.getItem(key);
  if (result) {
    result = JSON.parse(result);
    if (Date.parse(result.timeout) >= new Date()) {
      return result.value || result.data;
    }
  }
  return ""
},

/**
* @method _get
* @param key {String}       键值
* @param value {String}     value
* @param timeout {String}   过时时间
* @description 设置本地持久层数据
*/
adOptions._set = function (key, value, timeout) {
  var entity = {
    value: value,
    timeout: timeout
  };
  window.localStorage.setItem(key, JSON.stringify(entity));
}

/** 由于此文件同时运行至webapp 以及 H5站点，而h5站点是不依赖框架的，所以这里做了一个适配  */
if (window.location.pathname.indexOf('webapp') > -1 || window.localStorage.getItem('isInApp')) {
  define(['cBase', 'cUIAbstractView', 'libs', 'cStore'], function (cBase, AbstractView, libs, cStore) {
    var AdView = new cBase.Class(AbstractView, adOptions);
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