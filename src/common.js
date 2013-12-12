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
    'text'                      : 'src/res/libs/require.text',
    'App'                       : 'src/app',
    'c'                         : 'src/common/c',
    'cUI'                       : 'src/common/c.ui',
    'cHistory'                  : 'src/common/c.history',

    'cUtility'                  : 'src/common/c.utility',
    'cBase'                     : 'src/common/c.base',
    'cView'                     : 'src/common/c.view',
    'cModel'                    : 'src/common/c.model',             //提供model的基础类
    'cStore'                    : 'src/common/c.store',             //提供存取具体数据的Store基础类
    'cStorage'                  : 'src/common/c.storage',           //提供存取localStorage/sessionStorage的静态方法
    'cAjax'                     : 'src/common/c.ajax',
    'cLog'                      : 'src/common/c.log',
    'cDataSource'               : 'src/common/c.ui.datasource',     //数据源
    'cValidate'                 : 'src/common/c.validate',          //数据验证

    'CommonStore'               : 'src/common/c.common.store',      //公用的store
    'cHybridFacade'             : 'src/hybrid/c.hybrid.facade',
    'cSales'                    : 'src/common/c.sales',             //渠道模块
    'cMultipleDate'             : 'src/common/c.multiple.data',     //多重数据对象
    'cLazyload'                 : 'src/common/c.lazyload',          //加载
    'cListAdapter'              : 'src/common/c.common.listadapter',
    // 'cAdView'                   : 'src/common/c.ui.ad',
    'cGeoService'               : 'src/common/c.geo.service',
    'memStore'                  : 'src/store/c.memorystore',
    'cBasePageView'             : 'src/page/c.page.base',
    'cCommonPageFactory'        : 'src/page/c.page.factory',
    'cUserModel'                : 'src/model/c.user.model',
    'cCommonListPage'           : 'src/page/c.page.common.list',

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

    //--------------------------------------------------------------
    // ui控件库
    'cUIAbstractView'           : 'src/ui/c.ui.abstract.view',
    'cAdView'                   : 'src/ui/c.ui.ad',
    'cUIAlert'                  : 'src/ui/c.ui.alert',
    'cUIAnimation'              : 'src/ui/c.ui.animation',
    // 'cUICitylist'               : 'src/ui/c.ui.citylist',
    'cUIHeadWarning'            : 'src/ui/c.ui.head.warning',
    'cUIInputClear'             : 'src/ui/c.ui.input.clear',
    'cUILayer'                  : 'src/ui/c.ui.layer',
    'cUILoading'                : 'src/ui/c.ui.loading',
    'cUILoadinglayer'           : 'src/ui/c.ui.loading.layer',
    'cUIMask'                   : 'src/ui/c.ui.mask',
    'cUIPageview'               : 'src/ui/c.ui.page.view',
    'cUIScrollradio'            : 'src/ui/c.ui.scroll.radio',
    'cUIScrollradiolist'        : 'src/ui/c.ui.scroll.radio.list',
    'cUIScrollList'             : 'src/ui/c.ui.scrolllist',
    'cUIScrollLayer'            : 'src/ui/c.ui.scrollLayer',
    'cUIToast'                  : 'src/ui/c.ui.toast',
    'cUIWarning'                : 'src/ui/c.ui.warning',
    'cUIWarning404'             : 'src/ui/c.ui.warning404'
  }
});