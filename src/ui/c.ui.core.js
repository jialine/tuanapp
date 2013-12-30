define(['cHistory', 'cView', 'cDataSource', 'cUIBase', 'cUIAbstractView', 'cAdView', 'cUIAlert', 'cUIAnimation', 'cUICitylist', 'cUIHeadWarning', 'cUIInputClear', 'cUILayer', 'cUILoading', 'cUILoadinglayer', 'cUIMask', 'cUIPageview', 'cUIScrollradio', 'cUIScrollradiolist', 'cUIScrollList', 'cUIScrollLayer', 'cUIToast', 'cUIWarning', 'cUIWarning404', 'cUIHashObserve', 'cUIEventListener'], function (cuiHistory, cuiView, cuiDataSource, cuiBase, cuiAbstractView, cuiAdView, cuiAlert, cuiAnimation, cuiCityList, cuiHeadWarning, cuiInputClear, cuiLayer, cuiLoading, cuiLoadingLayer,cuiMask, cuiPageView, cuiScrollRadio, cuiScrollRadioList, cuiScrollList, cuiScrollLayer, cuiToast, cuiWarning, cuiWarning404, cuiHashObserve, cuiEventListener) {

    var config = {
        // @description 框架内所有生成的元素的id，class都会加上此前缀
        prefix: 'cui-'
    };

    var cui = {
      History                 : cuiHistory,
      View                    : cuiView,
      DataSource              : cuiDataSource,
      Tools                   : cuiBase,
      config                  : config,
      AbstractView            : cuiAbstractView,
      AdView                  : cuiAdView,
      Alert                   : cuiAlert,
      Animation               : cuiAnimation,
      CityList                : cuiCityList,
      HeadWarning             : cuiHeadWarning,
      InputClear              : cuiInputClear,
      Layer                   : cuiLayer,
      Loading                 : cuiLoading,
      LoadingLayer            : cuiLoadingLayer,
      Mask                    : cuiMask,
      PageView                : cuiPageView,
      ScrollRadio             : cuiScrollRadio,
      ScrollRadioList         : cuiScrollRadioList,
      ScrollList              : cuiScrollList,
      ScrollLayer             : cuiScrollLayer,
      Toast                   : cuiToast,
      Warning                 : cuiWarning,
      HashObserve             : cuiHashObserve,
      EventListener           : cuiEventListener
    }

    return cui;
});