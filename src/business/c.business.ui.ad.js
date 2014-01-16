define(['cCoreInherit', 'cAdView'], function (cCoreInherit, AdView) {

  var options = {};

  options.checkForceDownload = function (sourceid) {
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

        if (AppConfigMap && AppConfigMap.ad_download) {
          if (AppConfigMap.ad_download.url) url = AppConfigMap.ad_download.url;
        }

        if (s && s.sid && +s.sid > 0 && +s.sid == +sourceid && s.appurl && s.appurl.length > 0) {
          url = s.appurl;
        }
        adOptions.saveExpire();
        self.hide();
        window.location.href = url;
      }
    }, appUrl);
  };
  
  var BusinessAdView = new cCoreInherit.extend(AdView, options);

  return BusinessAdView;

});