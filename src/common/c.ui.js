define([
  'cUIAbstractView',
  'cUIAlert',
  'cUIAnimation',
  'cUICitylist',
  'cUIHeadWarning',
  'cUIInputClear',
  'cUILayer',
  'cUILoading',
  'cUILoadinglayer',
  'cUIMask',
  'cUIPageview',
  'cUIScrollradio',
  'cUIScrollradiolist',
  'cUIScrollList',
  'cUIScrollLayer',
  'cUIToast',
  'cUIWarning',
  'cUIWarning404',
  'cHistory'],
  function (cuiAbstractView, cuiAlert, cuiAnimation, cuiCitylist, cuiHeadWarning, cuiInputClear, cuiLayer, cuiLoading, cuiLoadingLayer, cuiMask, cuiPageview, cuiScrollradio, cuiscrollradiolist, cuiScrolllist, cuiScrolllayer, cuiToast, cuiWarning, cuiWarning404, cuiHistory) {
    var cui = {
      Tools: cuiToast,
      AbstractView: cuiAbstractView,
      Mask: cuiMask,
      Layer: cuiLayer,
      Alert: cuiAlert,
      PageView: cuiPageview,
      Loading: cuiLoading,
      LoadingLayer: cUILoadinglayer,
      Warning: cuiWarning,
      ScrollRadioList: cuiScrolllist,
      ScrollRadio: cuiScrollradio,
      HeadWarning: cuiHeadWarning,
      Toast: cuiToast,
      Warning404: cuiWarning404,
      InputClear: cuiInputClear
    }
    return cui;
});


