/* File Created: 六月 23, 2013 */

define(['cBase', 'cUI', 'cUtility', 'cView', 'cModel', 'cStore', 'cStorage', 'cAjax', 'CommonStore', 'cLazyload', 'cLog'], function (cBase, cUI, cUtility, cView, cModel, cStore, cStorage, cAjax, cCommonStore, lazyload, cLog) {

    var c = {
        base: cBase,
        ui: cUI,
        view: cView,
        utility: cUtility,
        store: cStore,
        storage: cStorage,
        model: cModel,
        ajax:cAjax,
        log: cLog,
        commonStore: cCommonStore,
        lazyload: lazyload
    };
    return c;
});