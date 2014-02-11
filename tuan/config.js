(function(){
	var BASE_URL = '/';

	var config = {
		baseUrl: BASE_URL,
		shim: {
			_: {
				exports: "_"
			},
			B: {
				deps: ["_"],
				exports: "Backbone"
			},
			cBase: {
				exports: "cBase"
			},
			cAjax: {
				exports: "cAjax"
			},
			cView: {
				deps: ["B"],
				exports: "cView"
			}
		},
		paths: {
			text: "res/libs/require.text",
			App: BASE_URL+"src/app",
			c: BASE_URL+"src/common/c",
			cUtility: BASE_URL+"src/common/c.utility",
			cBase: BASE_URL+"src/common/c.base",
			cLog: BASE_URL+"src/common/c.log",
			cValidate: BASE_URL+"src/common/c.validate",
			cSales: BASE_URL+"src/common/c.sales",
			cLazyload: BASE_URL+"src/common/c.lazyload",
			cListAdapter: BASE_URL+"src/common/c.common.listadapter",
			cGeoService: BASE_URL+"src/common/c.geo.service",
			rsa: BASE_URL+"src/common/c.rsa",
			Validate: BASE_URL+"src/common/c.validate",
			cAjax: BASE_URL+"src/common/c.ajax",
			cAbstractModel: BASE_URL+"src/model/c.abstract.model",
			cModel: BASE_URL+"src/model/c.model",
			cUserModel: BASE_URL+"src/model/c.user.model",
			cMultipleDate: BASE_URL+"src/model/c.multiple.data",
			memStore: BASE_URL+"src/store/c.memorystore",
			cStore: BASE_URL+"src/store/c.store",
			cStorage: BASE_URL+"src/store/c.storage",
			CommonStore: BASE_URL+"src/store/c.common.store",
			cUI: BASE_URL+"src/ui/c.ui",
			cUICore: BASE_URL+"src/ui/c.ui.core",
			cHistory: BASE_URL+"src/ui/c.ui.history",
			cView: BASE_URL+"src/ui/c.ui.view",
			cDataSource: BASE_URL+"src/ui/c.ui.datasource",
			cUIAbstractView: BASE_URL+"src/ui/c.ui.abstract.view",
			cAdView: BASE_URL+"src/ui/c.ui.ad",
			cUIAlert: BASE_URL+"src/ui/c.ui.alert",
			cUIAnimation: BASE_URL+"src/ui/c.ui.animation",
			cUIBase: BASE_URL+"src/ui/c.ui.base",
			cUIEventListener: BASE_URL+"src/ui/c.ui.event.listener",
			cUIHashObserve: BASE_URL+"src/ui/c.ui.hash.observe",
			cUIWarning: BASE_URL+"src/ui/c.ui.warning",
			cUIHeadWarning: BASE_URL+"src/ui/c.ui.head.warning",
			cUIInputClear: BASE_URL+"src/ui/c.ui.input.clear",
			cUILayer: BASE_URL+"src/ui/c.ui.layer",
			cUILoading: BASE_URL+"src/ui/c.ui.loading",
			cUILoadingLayer: BASE_URL+"src/ui/c.ui.loading.layer",
			cUIMask: BASE_URL+"src/ui/c.ui.mask",
			cUIPageview: BASE_URL+"src/ui/c.ui.page.view",
			cUIScrollRadio: BASE_URL+"src/ui/c.ui.scroll.radio",
			cUIScrollRadioList: BASE_URL+"src/ui/c.ui.scroll.radio.list",
			cUIScrollList: BASE_URL+"src/ui/c.ui.scrolllist",
			cUIScrollLayer: BASE_URL+"src/ui/c.ui.scrolllayer",
			cUIToast: BASE_URL+"src/ui/c.ui.toast",
			cUIWarning404: BASE_URL+"src/ui/c.ui.warning404",
			cUICitylist: BASE_URL+"src/ui/c.ui.citylist",
			cWidgetFactory: BASE_URL+"src/widget/c.widget.factory",
			cWidgetHeaderView: BASE_URL+"src/widget/c.widget.headerview",
			cWidgetListView: BASE_URL+"src/widget/c.widget.listview",
			cWidgetTipslayer: BASE_URL+"src/widget/c.widget.tipslayer",
			cWidgetInputValidator: BASE_URL+"src/widget/c.widget.inputValidator",
			cWidgetPublisher: BASE_URL+"src/widget/c.widget.publisher",
			cWidgetGeolocation: BASE_URL+"src/widget/c.widget.geolocation",
			cWidgetAbstractCalendar: BASE_URL+"src/widget/c.widget.abstract.calendar",
			cWidgetCalendar: BASE_URL+"src/widget/c.widget.calendar",
			cWidgetCalendarPrice: BASE_URL+"src/widget/c.widget.calendar.price",
			cWidgetSlide: BASE_URL+"src/widget/c.widget.slide",
			cWidgetMember: BASE_URL+"src/widget/c.widget.member",
			cWidgetGuider: BASE_URL+"src/widget/c.widget.guider",
			cWidgetCaptcha: BASE_URL+"src/widget/c.widget.captcha",
			cBasePageView: BASE_URL+"src/page/c.page.base",
			cCommonPageFactory: BASE_URL+"src/page/c.page.factory",
			cCommonListPage: BASE_URL+"src/page/c.page.common.list",
			cHybridFacade: BASE_URL+"src/hybrid/c.hybrid.facade",

			//custom models
			TuanStore: BASE_URL+"tuan/models/tuanstore",
			TuanModel: BASE_URL+"tuan/models/tuanmodel"
		}
	};
	require.config(config);
})();
