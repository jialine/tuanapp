define(['cBase', 'cUIView', 'CommonStore', 'cSales', 'cUtility'], function (cBase, cUIView, CommonStore, cSales, Util) {

  var options = {
    //@description 获得guid
    getGuid: function () {
      return Util.getGuid();
    },

    sendGa: function () {
      //ga统计
      if (typeof _gaq !== 'undefined') {
        var url = this._getAurl();
        _gaq.push(['_trackPageview', url]);
      } else {
        setTimeout($.proxy(this.sendGa, this), 300);
      }
    },

    sendKenshoo: function () {
      var query = this.request.query;
      if (query && query.orderid) {
        var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
        kurl += "&val=" + query.val + "&orderId=" + query.orderid + "&type=" + query.type;
        var imgHtml = "<img width='1' height='1' src='" + kurl + "'/>"
        $('body').append(imgHtml);
      }
    },
    //处理渠道
    disposeChannel: function () {
      var AllianceID = this.getQuery('allianceid'), SID = this.getQuery('sid'), OUID = this.getQuery('ouid');
      var UNION;
      if (AllianceID && SID) {
        UNION = {
          AllianceID: AllianceID,
          SID:        SID,
          OUID:       OUID
        };
        CommonStore.UnionStore.getInstance().set(UNION);
      } else {
        var local = location.host, refUrl = document.referrer;
        if (local && refUrl.indexOf(local) === -1) {
          refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
          if (refUrl.indexOf('baidu') > -1) {
            AllianceID = AllianceID || '4897';
            SID = SID || '353693';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('google') > -1) {
            AllianceID = AllianceID || '4899';
            SID = SID || '353694';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('soso.com') > -1) {
            AllianceID = AllianceID || '4900';
            SID = SID || '353696';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('sogou') > -1) {
            AllianceID = AllianceID || '4901';
            SID = SID || '353698';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('m.so.com') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353699';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('so.360') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353700';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('bing.com') > -1) {
            AllianceID = AllianceID || '4902';
            SID = SID || '353701';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('yahoo') > -1) {
            AllianceID = AllianceID || '4903';
            SID = SID || '353703';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('youdao') > -1) {
            AllianceID = AllianceID || '4904';
            SID = SID || '353704';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353700';
            OUID = OUID || '';
          }
          if (AllianceID && SID) {
            UNION = {
              AllianceID: AllianceID,
              SID:        SID,
              OUID:       OUID
            };
            CommonStore.UnionStore.getInstance().set(UNION);
          }
        }
      }
    },
    updateSales:     function ($el) {
      var local = location.host, refUrl = document.referrer, seosales = '';
      if (local && refUrl.indexOf(local) === -1) {
        refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
        if (refUrl.indexOf('baidu') > -1) {
          seosales = 'SEO_BAIDU';
        }
        if (refUrl.indexOf('google') > -1) {
          seosales = 'SEO_GOOGLE';
        }
        if (refUrl.indexOf('soso.com') > -1) {
          seosales = 'SEO_SOSO';
        }
        if (refUrl.indexOf('sogou') > -1) {
          seosales = 'SEO_SOGOU';
        }
        if (refUrl.indexOf('m.so.com') > -1) {
          seosales = 'SEO_SO';
        }
        if (refUrl.indexOf('so.360') > -1) {
          seosales = 'SEO_360SO';
        }
        if (refUrl.indexOf('bing.com') > -1) {
          seosales = 'SEO_BING';
        }
        if (refUrl.indexOf('yahoo') > -1) {
          seosales = 'SEO_YAHOO';
        }
        if (refUrl.indexOf('youdao') > -1) {
          seosales = 'SEO_YOUDAO';
        }
        if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
          seosales = 'SEO_360SO';
        }
      }
      var appSourceid = window.localStorage.getItem('SOURCEID');
      var newSourceid = this.getQuery('sourceid'), newSales = this.getQuery('sales');
      var _sales = CommonStore.SalesStore.getInstance().get();
      var sales = this.getQuery('sales') || seosales || (_sales && _sales.sales), sourceid = this.getQuery('sourceid') || appSourceid || (_sales && _sales.sourceid);
      if ((newSourceid && +newSourceid > 0) || (newSales && newSales.length > 0)) {
        //移除APP_DOWNLOAD
        cStorage.localStorage.oldRemove("APP_DOWNLOAD");
      }
      if (sales || sourceid) {
        if (sales) {
          cSales.setSales(sales);
        }
        if (sourceid) {
          cSales.setSourceId(sourceid);
        }

        cSales.getSalesObject(sales || sourceid, $.proxy(function (data) {
          this.warning404.tel = data.tel ? data.tel : '4000086666';
          cSales.replaceContent($el);
        }, this));
      } else {
        if (local && refUrl.indexOf(local) === -1) {
          refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
          if (refUrl.indexOf('baidu') > -1) {
            sales = 'SEO_BAIDU';
          }
          if (refUrl.indexOf('google') > -1) {
            sales = 'SEO_GOOGLE';
          }
          if (refUrl.indexOf('soso.com') > -1) {
            sales = 'SEO_SOSO';
          }
          if (refUrl.indexOf('sogou') > -1) {
            sales = 'SEO_SOGOU';
          }
          if (refUrl.indexOf('m.so.com') > -1) {
            sales = 'SEO_SO';
          }
          if (refUrl.indexOf('so.360') > -1) {
            sales = 'SEO_360SO';
          }
          if (refUrl.indexOf('bing.com') > -1) {
            sales = 'SEO_BING';
          }
          if (refUrl.indexOf('yahoo') > -1) {
            sales = 'SEO_YAHOO';
          }
          if (refUrl.indexOf('youdao') > -1) {
            sales = 'SEO_YOUDAO';
          }
          if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
            seosales = 'SEO_360SO';
          }
          if (sales) cSales.setSales(sales);
          setTimeout(function () {
            cSales.replaceContent($el);
          }, 1);
        }
      }
    },

    _sendUbt: function () {
      if (window.$_bf && window.$_bf.loaded == true) {
        var url = this._getAurl(), query = this.request.query, pId = $('#page_id'), oId = $('#bf_ubt_orderid');
        var pageId = +(this.pageid);
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

    onShowFinish:function(){
      this._sendUbt();

      this.updateSales(this.$el);
      if (this.onBottomPull) {
        this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
        this.addScrollListener();
      }
      //ga统计
      this.sendGa();

      //Kenshoo统计
      this.sendKenshoo();

    },
    _getDefaultHeader: function () {
      return {
        backUrl:     null,
        home:        false,
        phone:       null,
        title:       null,
        subtitle:    null,
        rightAction: null
      };
    }
  };

  return cUIView.extend(options);
});
