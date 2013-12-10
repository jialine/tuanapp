require.config({
    baseUrl: '/webapp/',
    shim: {
        _: {
            exports: '_'
        },
        B: {
            deps: [
            '_'
            ],
            exports: 'Backbone'
        },
        cBase: {
            exports: 'cBase'
        },
        cAjax: {
            exports: 'cAjax'
        },
        cView: {
            deps: [
            'B'
            ],
            exports: 'cView'
        }
    },
    paths: {
        'text': 'res/libs/require.text',

        'App': 'app/app',

        // ---------------------------------------------------
        // 基础库
        'c': 'app/common/c',

        'cUICore'                   : 'app/common/c.ui.core',
        'cUI'                       : 'app/common/c.ui',
        'cHistory'                  : 'app/common/c.ui.history',
        // 'cChineseCal'            : 'app/common/c.ui.calendar_chinese',
        // 'cPriceCal'              : 'app/common/c.ui.calendar_price',
        // 'cCalendar'              : 'app/common/c.ui.calendar',
        // 'cUISlide'               : 'app/common/c.ui.slide',
        'cUIScrollList': 'app/common/c.ui.scrolllist',
        'cUIScrollLayer': 'app/common/c.ui.scrollLayer',

        'cUIAnimation'              : 'app/common/c.ui.animation',

        'cUtility'                  : 'app/common/c.utility',
        'cBase'                     : 'app/common/c.base',
        'cView'                     : 'app/common/c.ui.view',
        'cModel'                    : 'app/common/c.model', //提供model的基础类
        'cStore'                    : 'app/common/c.store', //提供存取具体数据的Store基础类
        'cStorage'                  : 'app/common/c.storage', //提供存取localStorage/sessionStorage的静态方法
        'cAjax'                     : 'app/common/c.ajax',
        'cLog'                      : 'app/common/c.log',
        'cDataSource'               : 'app/common/c.ui.datasource', //数据源
        'cValidate'                 : 'app/common/c.validate', //数据验证

        'CommonStore'               : 'app/common/c.common.store', //公用的store
        'cHybridFacade'             : 'app/hybrid/c.hybrid.facade',
        'cSales'                    : 'app/common/c.sales', //渠道模块
        'cMultipleDate'             : 'app/common/c.multiple.data', //多重数据对象
        'cLazyload'                 : 'app/common/c.lazyload', //加载
        'cListAdapter'              : 'app/common/c.common.listadapter',
        'cAdView'                   : 'app/common/c.ui.ad',
        'cGeoService'               : 'app/common/c.geo.service',
        'memStore'                  : 'app/store/c.memorystore',
        'cBasePageView'             : 'app/page/c.page.base',
        'cCommonPageFactory'        : 'app/page/c.page.factory',
        'cUserModel'                : 'app/model/c.user.model',

        'cWidgetFactory'            : 'app/widget/c.widget.factory',
        'cWidgetHeaderView'         : 'app/widget/c.widget.headerview',
        'cWidgetListView'           : 'app/widget/c.widget.listview',
        'cWidgetTipslayer'          : 'app/widget/c.widget.tipslayer',
        'cWidgetInputValidator'     : 'app/widget/c.widget.inputValidator',
        'cWidgetPublisher'          : 'app/widget/c.widget.publisher',
        'cWidgetGeolocation'        : 'app/widget/c.widget.geolocation',
        'cWidgetAbstractCalendar'   : 'app/widget/c.widget.abstract.calendar',
        'cWidgetCalendar'           : 'app/widget/c.widget.calendar',
        'cWidgetCalendarPrice'      : 'app/widget/c.widget.calendar.price',
        'cWidgetSlide'              : 'app/widget/c.widget.slide',
        'cWidgetMember'             : 'app/widget/c.widget.member',
        'cWidgetGuider'             : 'app/widget/c.widget.guider',

        'cCommonListPage'           : 'app/page/c.page.common.list'
    }
});