define(['cBase', 'cStorage', 'libs', 'CommonStore', 'cUtility', 'cAbstractModel'], function (cBase, cStorage, libs, CommonStore, cUtility, AbstractModel) {
  var __SALES__ = null;
  var salesOStore = CommonStore.SalesObjectStore.getInstance();

  //    var getServerUrl = function () {
  //        var host = location.host;
  //        if (cUtility.isInApp()) {
  //            if (cUtility.isPreProduction() == '1') {   // 定义堡垒环境
  //                return 'm.ctrip.com';
  //            } else if (cUtility.isPreProduction() == '0') {   // 定义测试环境
  //                return 'waptest.ctrip.com';
  //            } else {
  //                return 'm.ctrip.com';
  //            }
  //            //还差一个生产
  //        } else if (host.match(/^m\.ctrip\.com/i)) {
  //            return 'm.ctrip.com';
  //        } else if (host.match(/^(localhost|172\.16|127\.0)/i)) {
  //            return 'waptest.ctrip.com';
  //        } else if (host.match(/^10\.8\.2\.111/i)) {
  //            return '10.8.2.111';
  //        } else if (host.match(/^waptest\.ctrip/i)) {
  //            return 'waptest.ctrip.com';
  //        } else {
  //            return 'm.ctrip.com';
  //        }
  //    }
  var getServerUrl = function (protocol) {
    // @description 直接调用AbstractModel的方法，如果是https的站点，需要传入protocol='https'
    return AbstractModel.baseurl(protocol);
  };

  var getSalesObject = function (sales, callback, error) {
    var salesObject = salesOStore.get(sales);
    if (salesObject) {
      __SALES__ = salesObject;
      if (!salesObject.appurl || salesObject.appurl.length <= 0) {
        $('#dl_app').hide();
      } else {
        $('#dl_app').show();
      }
      callback && callback(salesObject);
    } else {
      var serverPath = getServerUrl();
      var url = 'http://' + serverPath + '/html5/ClientData/GetSalesInfo/' + sales;
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        success: $.proxy(function (data) {
          var _data = {};
          if (data.ServerCode == 1) {

            if (data.Data) {
              for (var i in data.Data) _data[i.toLowerCase()] = data.Data[i];
              data.Data = _data;
              salesOStore.set(data.Data, sales);
              var day = 30;
              if (data.Data && (data.Data.sales === 'ydwxcs' || data.Data.sales === '1622')) {
                day = 5;
              }
              if (!data.Data.appurl || data.Data.appurl.length <= 0) {
                $('#dl_app').hide();
              } else {
                $('#dl_app').show();
              }
              cStorage.localStorage.oldSet('SALESOBJ', JSON.stringify({
                data: data.Data,
                timeout: (new cBase.Date(cBase.getServerDate())).addDay(day).format('Y/m/d H:i:s')
              }));
            }
            __SALES__ = data.Data;
            callback && callback(data.Data);
          } else {
            error && error(data);
          }
        }, this),
        error: $.proxy(function (e) {
          error && error(e);
        }, this)
      });
    }
  };

  var getSales = function () {
    return __SALES__;
  },
    setSales = function (sales) {
      CommonStore.SalesStore.getInstance().set({ 'sales': sales });
    },
    setSourceId = function (sourceid) {
      CommonStore.SalesStore.getInstance().set({ 'sourceid': sourceid });
    },
    setUnion = function (Union) {
      CommonStore.UnionStore.getInstance().set(Union);
    };
  var RegTel = /400\d{3}\d{4}/i,
        RegTelTitle = /400\s+\d{3}\s+\d{4}/i,
        RegTelTitle2 = /400-\d{3}-\d{4}/i;
  var ua = navigator.userAgent;
  var isApple = !!ua.match(/(ipad|iphone)/i),
        isAndroid = !!ua.match(/android/i),
        isWinPhone = !!ua.match(/MSIE/i);
  var replaceStrTel = window.replaceStrTel = function (str) {
    var salesObj = getSales();
    if (typeof str === 'string' && salesObj && salesObj.tel) {
      str = str.replace(RegTel, salesObj.tel);
      str = str.replace(RegTelTitle, salesObj.teltitle);
      if (salesObj.teltitle) str = str.replace(RegTelTitle2, salesObj.teltitle.split(' ').join('-'));
    }
    return str;
  };
  var getPlatFormCode = function () {

    var platform = null;
    if (isApple) {
      platform = "ios-app";
    } else if (isAndroid) {
      platform = "andreod-app";
    } else if (isWinPhone) {
      platform = "win-app";
    }
    return platform;
  };
  //替换app下载地址
  var replaceStrApp = function (str) {
    var salesObj = getSales();
    if (salesObj) {
      if (salesObj.isseo) {
        $('.module').show();
      }
      if (salesObj.appurl) {
        return salesObj.appurl;
      } else {
        var str = salesObj.sid ? salesObj.sid : salesObj.sales;
        return "/market/download.aspx?from=" + str;
      }
    }
    return null;
  };

  //替换页面中的400电话
  function replaceContent(el) {
    //修改链接中的电话
    var MARKLINKCLASS = '.__hreftel__',
    //修改内容中的电话
            MARKCONTCLASS = '.__conttel__',
    //修改应用的下载链接
            MAREAPPADDRESS = '.__appaddress__';
    $(el[0]).find(MARKLINKCLASS).each(function () {
      this.href = replaceStrTel(this.href);
    });
    $(el[0]).find(MARKCONTCLASS).each(function () {
      var $this = $(this);
      $this.html(replaceStrTel($this.html()));
    });
    //$(el[0]).find(MAREAPPADDRESS).each(function () {
    $(MAREAPPADDRESS).each(function () {
      var href = replaceStrApp();
      if (!href) {
        switch (true) {
          case isApple:
            href = $(this).attr('data-ios-app');
            break;
          case isAndroid:
            href = $(this).attr('data-android-app');
            break;
          case isWinPhone:
            href = $(this).attr('data-win-app');
            break;
        }
      }
      if (href) {
        $(this).attr('href', href);
      }

    });
  }
  return {
    //替换当前页面中内容
    replaceContent: replaceContent,
    //接受一个参数，让其替换为
    replaceStrTel: replaceStrTel,
    //设置sales渠道
    setSales: setSales,
    getSales: getSales,
    getSalesObject: getSalesObject,
    setUnion: setUnion,
    //设置sourceid渠道
    setSourceId: setSourceId
  };
});