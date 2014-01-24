require.config({
  baseUrl: '/',
  shim: {
    _: { exports: '_' },
    B: {
      deps: [ '_' ],
      exports: 'Backbone'
    },
    cBase: { exports: 'cBase' },
    cAjax: { exports: 'cAjax' },
    cView: {
      deps: [ 'B' ],
      exports: 'cView'
    }
  },

  paths: {
    'text'                      : 'res/libs/require.text',
    'AbstractAPP'               : 'src/c.abstract.app',
    'App'                       : 'src/business/c.business.app',
    // 'App'                       : 'src/app',
    'c'                         : 'src/common/c',
    'cUtility'                  : 'src/common/c.utility',
    'cBase'                     : 'src/common/c.base',
    'cLog'                      : 'src/common/c.log',
    'cValidate'                 : 'src/common/c.validate',          //数据验证
    'cSales'                    : 'src/common/c.sales',             //渠道模块
    'cLazyload'                 : 'src/common/c.lazyload',          //加载
    'cListAdapter'              : 'src/common/c.common.listadapter',
    'cGeoService'               : 'src/common/c.geo.service',


    //-------------------------------------------------------------
    'cCoreInherit'              : 'src/core/c.core.inherit',        // Class类，框架的基础类体系
    'cCoreDate'                 : 'src/core/c.core.date',           // Date对象，对时间提供一些常用方法
    'cBusinessServertime'       : 'src/business/c.business.servertime',
    'cCoreConsole'              : 'src/core/c.core.console',
    'cCoreHash'                 : 'src/core/c.core.hash',



    //-------------------------------------------------------------
    'cStore'                    : 'src/store/c.store',             //提供存取具体数据的Store基础类
    'cStorage'                  : 'src/store/c.storage',           //提供存取localStorage/sessionStorage的静态方法
    'memStore'                  : 'src/store/c.memorystore',
    'CommonStore'               : 'src/store/c.common.store',      //公用的store


    //--------------------------------------------------------------
    // model
    'cAjax'                     : 'src/common/c.ajax',
    'cAbstractModel'            : 'src/model/c.abstract.model',
    'cModel'                    : 'src/model/c.model',
    'cUserModel'                : 'src/model/c.user.model',
    'cMultipleDate'             : 'src/model/c.multiple.data',     //多重数据对象

    //--------------------------------------------------------------
    // ui控件库
    'cUI'                       : 'src/ui/c.ui',
    'cUICore'                   : 'src/ui/c.ui.core',
    'cHistory'                  : 'src/ui/c.ui.history',
    'cUIView'                   : 'src/ui/c.ui.view',
    'cView'                     : 'src/business/c.business.view',
    'cDataSource'               : 'src/ui/c.ui.datasource', //数据源
    'cUIBase'                   : 'src/ui/c.ui.base',
    'cUIAbstractView'           : 'src/ui/c.ui.abstract.view',
    'cAdView'                   : 'src/ui/c.ui.ad',
    'cUIAlert'                  : 'src/ui/c.ui.alert',
    'cUIAnimation'              : 'src/ui/c.ui.animation',
    'cUICitylist'               : 'src/ui/c.ui.citylist',
    'cUIHeadWarning'            : 'src/ui/c.ui.head.warning',
    'cUIInputClear'             : 'src/ui/c.ui.input.clear',
    'cUILayer'                  : 'src/ui/c.ui.layer',
    'cUILoading'                : 'src/ui/c.ui.loading',
    'cUILoadingLayer'           : 'src/ui/c.ui.loading.layer',
    'cUIMask'                   : 'src/ui/c.ui.mask',
    'cUIPageview'               : 'src/ui/c.ui.page.view',
    'cUIScrollRadio'            : 'src/ui/c.ui.scroll.radio',
    'cUIScrollRadioList'        : 'src/ui/c.ui.scroll.radio.list',
    'cUIScrollList'             : 'src/ui/c.ui.scrolllist',
    'cUIScrollLayer'            : 'src/ui/c.ui.scrolllayer',
    'cUIToast'                  : 'src/ui/c.ui.toast',
    'cUIWarning'                : 'src/ui/c.ui.warning',
    'cUIWarning404'             : 'src/ui/c.ui.warning404',
    'cUIHashObserve'            : 'src/ui/c.ui.hash.observe',
    'cUIEventListener'          : 'src/ui/c.ui.event.listener',

    //--------------------------------------------------------------
    // widget控件库
    'cWidgetFactory'            : 'src/widget/c.widget.factory',
    'cWidgetHeaderView'         : 'src/widget/c.widget.headerview',
    'cWidgetListView'           : 'src/widget/c.widget.listview',
    'cWidgetTipslayer'          : 'src/widget/c.widget.tipslayer',
    'cWidgetInputValidator'     : 'src/widget/c.widget.inputValidator',
    'cWidgetPublisher'          : 'src/widget/c.widget.publisher',
    'cWidgetGeolocation'        : 'src/widget/c.widget.geolocation',
    'cWidgetAbstractCalendar'   : 'src/widget/c.widget.abstract.calendar',
    'cWidgetCalendar'           : 'src/widget/c.widget.calendar',
    'cWidgetCalendarPrice'      : 'src/widget/c.widget.calendar.price',
    'cWidgetSlide'              : 'src/widget/c.widget.slide',
    'cWidgetMember'             : 'src/widget/c.widget.member',
    'cWidgetGuider'             : 'src/widget/c.widget.guider',
    'cWidgetCaptcha'            : 'src/widget/c.widget.captcha',

    //--------------------------------------------------------------
    // Common Page
    'cBasePageView'             : 'src/page/c.page.base',
    'cCommonPageFactory'        : 'src/page/c.page.factory',
    'cCommonListPage'           : 'src/page/c.page.common.list',

    //--------------------------------------------------------------
    // Hybrid
    'cHybridFacade'             : 'src/hybrid/c.hybrid.facade',

    // -------------------------------------------------------------
    // Business Widget
    'cBusinessWidgetMemberTip'   : 'src/business/c.business.widget.member.tip',
    'cBusinessWidgetChannelAd'   : 'src/business/c.business.widget.channel.ad',
	// Custom data
	'cDataCityList'              : 'tuan/data/citylist'
  }
});