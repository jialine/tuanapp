/**
  * @author li.xx
  * @since 20140213
  * @version 0.1
  * 发票页面
  */
define(['libs', 'c', 'TuanStore',TuanApp.getViewsPath('invoice')], function(libs, c, tStore, html) {
    'use strict';
    var invoiceStore, MSG;
    invoiceStore = tStore.TuanInvoiceStore.getInstance();
    MSG = {
        pageTitle: '发票',
        titleLessTip: '发票抬头不能为空',
        titleMoreTip: '发票抬头不能超过50个汉字',
        addrLessTip: '请填写详细地址',
        addrMoreTip: '详细地址不可多于50个汉字'
    };
    var View = c.view.extend({
        pageid: '',
        tpl: html,
        isFirstIn: true,
        latlon: null,
        
        render: function() {
            this.$el.html(this.tpl);
            var switchDom = this.$el.find('#J_switchList');
            this.els = {
                invoiceSwitchDom: switchDom,
                invoiceOnDom:    switchDom.find('.J_on'),
                invoiceOffDom:    switchDom.find('.J_off'),
                allItems: this.$el.find('.J_writeList').find('li'),
                titleDom: this.$el.find('#J_invoiceTitle'),
                addrDom: this.$el.find('#J_addr')
            };
        },
        
        events: {
            'click #J_submitOrder': 'submitInvoiceInfo',
            'click #J_switchList': 'isNeedAction',
            'click #J_return': function() {
                this.forward('booking');
            }
        },
        
        onCreate: function() {
            this.viewdata.req = this.request;
            this.render();
        },
        
        /**
            * 初始化数据加载
            */
        onLoad: function() {
            var invoice = invoiceStore.get();
            this.setTitle(MSG.pageTitle);
            this.updateHeader({ title: MSG.pageTitle });
            
            if (invoice) {
                if (invoice.needed) {
                    this._needInvoice();
                } else {
                    this._noNeedInvoice();
                }
                
                this.els.titleDom.val(invoice.title ? invoice.title : '');
                this.els.addrDom.val(invoice.addr ? invoice.addr : '');
                
            } else {
                this._noNeedInvoice();
            }
            
            this.turning();
        },
        
        onShow: function() {},
        
        onHide: function() {},
        
        isNeedAction: function() {
            if (this.els.invoiceOnDom.hasClass('current')) {
                this._noNeedInvoice();
            } else {
                this._needInvoice();
            }
        },
        
        _noNeedInvoice: function() {
            this.els.invoiceSwitchDom.find('.current').removeClass('current');
            this.els.invoiceOffDom.addClass('current');
            this.els.allItems.hide();
            this.els.invoiceSwitchDom.closest('li').show();
        },
        
        _needInvoice: function() {
            this.els.invoiceSwitchDom.find('.current').removeClass('current');
            this.els.invoiceOnDom.addClass('current');
            this.els.allItems.show();
        },
        
        submitInvoiceInfo: function() {
            var invoice = {
                needed: this.els.invoiceOnDom.hasClass('current'),
                title: this.els.titleDom.val().trim(),
                addr: this.els.addrDom.val().trim()
            };
            if (invoice.needed) {
                //发票抬头验证
                if (invoice.title.length === 0) {
                    this.showMessage(MSG.titleLessTip);
                    return false;
                } else if (invoice.title.length > 50) {
                    this.showMessage(MSG.titleMoreTip);
                    return false;
                }
                //详细地址验证
                if (invoice.addr.length === 0) {
                    this.showMessage(MSG.addrLessTip);
                    return false;
                } else if (invoice.addr.length > 50) {
                    this.showMessage(MSG.addrMoreTip);
                    return false;
                }
                
            }
            
            invoiceStore.set(invoice);
            this.forward('booking');
        }
        
    });
    
    return View;
});