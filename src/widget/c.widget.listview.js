/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  组件ListView
 */
define(['cBase', 'cUICore', 'cWidgetFactory'], function (cBase, cUICore, WidgetFactory) {
    "use strict";

    var WIDGET_NAME = 'ListView';

    // 如果WidgetFactory已经注册了ListView，就无需重复注册
    if (WidgetFactory.hasWidget(WIDGET_NAME)) {
        return;
    }

    /********************************
    * @description: 将已经创建的dom list改变为哈希表
    */
    var _hashMap = function (domlist) {
        var map = new cBase.Hash();
        for (var i = 0; i < domlist.length; i++) {
            map.add($(domlist[i]).data('hash'), $(domlist[i]));
        }
        return map;
    };

    var options = options || {};

    options.__propertys__ = function () { };

    options.initialize = function ($super, config) {
        // container是listview的容器，所有生产的itemview都会被加到container上去
        if (config.container) {
            this.rootBox = config.container;
        }

        // 无查询结果提示文案;
        this.noResultText = '您还没有记录哦';
        // 是否打开默认空视图
        this.autoEmptyView = (typeof config.autoEmptyView != 'undefined') ? config.autoEmptyView : true;
        if (config.noResultText) {
            this.noResultText = config.noResultText;
        }
        // listview的适配器，同时也是被观察者
        if (config.listadapter) {
            this.listadapter = config.listadapter;
            this.listadapter.regiseterObserver(this);
        }
        if (config.origin) {
            this.origin = config.origin;
        }
        // listview的子view
        if (config.itemView) {
            this.templateFactory = this.template(config.itemView);
        } else {
            throw 'ListView:no item view template';
        }

        // 设置用户自定义的时间绑定和回调
        this.bindItemViewEvent = config.bindItemViewEvent;
        this.onUpdatePrepared = config.onUpdatePrepared;
        this.onUpdateFinished = config.onUpdateFinished;

        $super(config);
    };

    /********************************
    * @description: AbstractView中必须override方法，用来在onCreate中创建具体的view
    */
    options.createHtml = function () {
        return this.update();
    };

    /********************************
    * @description: 加入itemview到container中去
    */
    options.createItemView = function (value, key) {
        var itemview = this.templateFactory(value);
        return $(itemview).addClass('c-item-view').data('hash', key);
    };

    /********************************
    * @description: 当listadapter中map的数据发生更新时，会比对dom和map中含有hash值，如果hash值相同则留用
    *               如果不同，以listadapter为主，listadapter有则创建新的itemview，无则删除dom
    */
    options.update = function () {
        var itemlist = this.rootBox.find('.c-item-view');
        this.map = _hashMap(itemlist);

        // 在Update之前进行的动作
        if (this.onUpdatePrepared && typeof this.onUpdatePrepared === 'function') {
            this.onUpdatePrepared();
        }

        var tempHash = new cBase.Hash();
        var self = this;
        var handler = function (value, key, index) {
            var itemview = self.map.getItem(key);
            if (!itemview) {
                value.C_ITEM_INDEX = index;
                value.__origin__ = self.origin;
                itemview = self.createItemView(value, key);
                self.bindItemViewEvent(itemview);
            }
            tempHash.add(key, itemview);
        };
        this.listadapter.map.each(handler);

        this.rootBox.hide();
        this.rootBox.empty();
        if (this.listadapter.list.length > 0) {
            var appendHandler = function (value, key, index) {
                self.rootBox.append(value);
            };
            tempHash.each(appendHandler);
        } else {
            if (this.autoEmptyView) {
                this.rootBox.append('<div class="cui-load-error"><div class="i cui-wifi cui-exclam"></div>' + this.noResultText + '</div>');
            }
        }

        this.rootBox.show();

        // 在Upage之后进行的动作
        if (this.onUpdateFinished && typeof this.onUpdateFinished === 'function') {
            this.onUpdateFinished();
        }
    };

    /********************************
    * @description: 在update之前的回调
    */
    options.onUpdatePrepared = function () { };

    /********************************
    * @description: 在update完成之后的回调
    */
    options.onUpdateFinished = function () { };

    /********************************
    * @description: 开启数据为空时自动显示预订视图功能
    */
    options.openAutoEmptyView = function () {
        this.autoEmptyView = true;
    }
    /********************************
    * @description: 关闭数据为空时自动显示预订视图功能
    */
    options.closeAutoEmptyView = function () {
        this.autoEmptyView = false;
    }
    var ListView = new cBase.Class(cUICore.AbstractView, options);

    // return ListView;
    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: ListView
    });
});