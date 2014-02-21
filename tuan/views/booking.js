/**
  * @author li.xx
  * @since 20140212
  * @version 0.1
  * 团购酒店订单填写页面
  */

define(['libs', 'c', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('booking'), '/tuan/com/numberStep.js'],
    function(libs, c, CStore, TStore, TModel, html, NumberStep) {
        'use strict';

        var orderInfo = TStore.TuanOrderInfoStore.getInstance(),//订单信息
        invoiceStore = TStore.TuanInvoiceStore.getInstance(), //发票信息,
        userStore = CStore.UserStore.getInstance(),//用户信息
        tuanDetailStore = TStore.TuanDetailsStore.getInstance(),//产品相关信息
        unionStore = CStore.UnionStore && CStore.UnionStore.getInstance(),//订单存储相关
        MSG,//提示信息
        ORDER_NUM = {
            max: 9,
            min: 1
        };//产品购买数量
    
        MSG = {
            submitTitle: '订单提交',
            submitTip: '由于您长时间未提交订单，数据可能已经过时，请返回重新选择',
            pageTitle: '订单填写',
            giftCard: '携程礼品卡',
            cash: '现金',
            alertTitle: '提示信息',
            leaveTips: '您的订单尚未完成，确定要离开吗？',
            cancel: '取消',
            sure: '确定',
            telTips: '请填写正确的手机号码',
            failTips: '抱歉，订单未能成功提交，请重试！',
            timeoutTips: '非常抱歉，由于您刚才提交的服务已超时，请稍后在“我的携程”中查看订单信息或拨打服务电话400-008-6666，以确认您的订单是否提交成功。',
        };

    
    //保留两位有效数字
    //TODO: 与原方法不一致.
    function retainTwoDecimal(str) {
        var num = parseFloat(str);
        if (isNaN(num)) {
            return str;
        }
        
        return Math.round(num * 100) / 100;
    }
    
    var View = c.view.extend({
        pageid: '214015',
        
        tpl: html,
        //是否是第一次进入此界面
        isFirstIn: true,
        //当前位置的经纬度
        latlon: null,
      
        render: function() {
            var self = this,
            store = tuanDetailStore.get(),
            userInfo = userStore.get(),
            order = orderInfo.get();

            this.store = store;

            if (store && store.id) {
                store.min = store.min > ORDER_NUM.min ? store.min : ORDER_NUM.min;
                store.max = store.max < ORDER_NUM.max ? ORDER_NUM.max : store.max;
            
                store.curNum = (order && order.curNum) || store.min;
                store.tel = (order && order.tel) || (userInfo && userInfo.Mobile) || '';
                store.retainTwoDecimal = retainTwoDecimal;
                store.user = userInfo;
                store.invoice = invoiceStore.get();
                
                //优惠及立减相关
                this._handlePrivilege(store);
            } else {
                this.showHeadWarning(MSG.submitTitle, MSG.submitTip, function() {
                    var store = tuanDetailStore.get();
                    if (store && store.id) {
                        self.jump('tuandetail!' + store.id);
                    } else {
                        //TODO:
                        self.forward('list');
                        // self.redirectToIndex();
                    }
                    this.hide();
                });
                
                return false;
            }
          
            this.pid = store.id;
            this.price = store.price.oPrice;
            
            this.$el.html(_.template(this.tpl, store));
            this.els = {
                curNumDom: this.$el.find('#J_curNum'),
                numStepDom: this.$el.find('.J_numberStep'),
                pPriceDom: this.$el.find('#J_pPrice'),
                totalPriceDom: this.$el.find('#J_totalPrice'),
                telDom: this.$el.find('#J_tel'),
                submitBtn: this.$el.find('#J_submitOrder')
            };
            this._createNumberStep();
        },
        
        events: {
            'click #J_return': 'cancelOrder',
            'click #J_home': 'redirectToIndex',
            'click #J_submitOrder': 'submitOrder',
            'focus #J_tel': function() {
                var self = this;
                this.submitBtnTimer = setInterval(function() {
                    self.changeBtnState();
                }, 500);
            },
            'blur #J_tel': function() {
                this.changeBtnState();
                if (this.submitBtnTimer) {
                    clearInterval(this.submitBtnTimer);
                }
            },
            'click #J_invoice': function() {
                this.forward('invoice');
            }
            
        },
        
        onCreate: function() {
            this.viewdata.req = this.request;
            orderInfo ? orderInfo.remove() : '';
        },
        
        onLoad: function() {
            this.updateHeader({title: MSG.pageTitle});
            this.render();
            this.turning();
        },
        
        onShow: function() {
            this.setTitle(MSG.pageTitle);
        },
        
        onHide: function() {},
        
        //TODO: Not very good.
        redirectToIndex: function() {
            var loc = window.location;
            window.location.href = loc.protocol + '//' + loc.hostname + '/html5';
        },
        
        cancelOrder: function() {
            var self = this;
            var returnAlert = new c.ui.Alert({
                title: MSG.alertTitle,
                message: MSG.leaveTips,
                buttons: [{text: MSG.cancel, click: function() {
                    this.hide();
                }},
                {text: MSG.sure, click: function() {
                    this.hide();
                    self.showLoading();
                    setTimeout(function() {
                      var store = tuanDetailStore.get();
                      if (store && store.id) {
                        self.jump('#tuandetail!' + store.id);
                      } else {
                        self.redirectToIndex();
                      }
                    }, 200);
                }}]
            });
            
            //TODO: session过期之后如果显示headWarning, 则不再显示alert警告
            if (this.store && this.store.id) {
                returnAlert.show();
            }
        },
        
        changeBtnState: function() {
            var tel = this.els.telDom.val();
            if ( '' === tel) {
                this.els.submitBtn.addClass('disabled');
            } else {
                this.els.submitBtn.removeClass('disabled');
            }
            orderInfo.setAttr('tel', tel);
        },
        
        submitOrder: function() {
            var self = this,
            tel = this.els.telDom.val(), //电话号码
            num = this.numberStep.getCurrentNum(), //购买数量
            param = {}, //AJAX 请求参数
            iStore = invoiceStore.get(), //发票Store
            tStore = tuanDetailStore.get(),//团购详情Store
            uStore = userStore.getUser(), //用户Store
            headStore = CStore.HeadStore.getInstance().get(), //url header Store
            unionData = unionStore && unionStore.get(); //unionStore 数据

            orderInfo.setAttr('curNum', num);
          
            if (!tel || (tel === '') || !c.utility.validate.isMobile(tel)) {
                this.showMessage(MSG.telTips);
                return;
            }
          
            if (!tStore || !tStore.id) {
                this.showHeadWarning(MSG.pageTitle, MSG.submitTip, function() {
                    self.forward('tuandetail!' + self.pid);
                    this.hide();
                });
                return;
            }
          
          // param.hasInvoice = false;
            param.needed = false;
            if (iStore && iStore.needed) {
                param.needed = iStore.needed;
                param.invoiceTitle = iStore.title;
                param.recipient = iStore.recipient;
                param.addr = iStore.addr;
                param.invoiceZip = iStore.zip;
            }
          
            param.mphone = tel;
            param.qty = num;
            param.pid = tStore.id;
            param.totalprice = parseFloat(tStore.price.oPrice);
            if (uStore && uStore.IsNonUser == false) {
                param.Auth = uStore.Auth;
                param.UID = uStore.UserID;
                param.LoginToken = uStore.loginToken;
            }
            param.SourceId = headStore && (headStore.sid || '');
            param.SourceId = param.SourceId == '8888' ? '' : param.SourceId;
          
            if (unionData) {
                param.AllianceID = unionData.AllianceID;
                param.OUID = unionData.OUID;
                param.SID = unionData.SID;
            }
            this.showLoading();
            this._sendOrderRequest(param);
          
        },
        
        _createNumberStep: function() {
            var self = this;
            this.numberStep = new NumberStep({
            max: self.store.max < ORDER_NUM.max ? self.store.max : ORDER_NUM.max,
            min: self.store.min > ORDER_NUM.min ? self.store.min : ORDER_NUM.min,
            initialVal: self.store.curNum,
            wrap: self.els.numStepDom,
            onChange: function() {
                var store = self.store,
                activity,
                pPrice,
                num = parseInt(self.$el.find('#J_curNum').text().trim());
                if (store.activities && store.activities.length > 0 &&
                    self.els.pPriceDom[0]) {
                    activity = store.activities[0];
                    pPrice = activity.arg * num;
                    self.els.pPriceDom.html(pPrice);
                }
                self.els.totalPriceDom.html(retainTwoDecimal(parseFloat(self.price) * num));
            }
            });
        },
        
        _handlePrivilege: function(store) {
            var activity, oPrice;
            if (store.activities && store.activities[0] && store.activities[0].arg) {
                activity = store.activities[0];
                oPrice = store.price.oPrice;
                store.price.oPrice = retainTwoDecimal(oPrice);
                //TODO: need to verify type of activity.type
                if (activity.type === 1) {
                  store.price.oPrice = retainTwoDecimal(oPrice - activity.arg);
                }
            }
        },
        _sendOrderRequest: function(param) {
            var self = this;
            $.ajax({
                url: 'http://m.ctrip.com/html5/Group/SubmitGroupOrder',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                timeout: 200000,
                data: JSON.stringify(param),
                success: function(data) {
                    if (data && parseInt(data.ServerCode) == 1) {
                        if (data.User) {
                          userStore.setUser(data.User);
                        }
                        window.location = data.Message;
                    } else {
                        if (data && data.Message) {
                          self.showMessage(data.Message);
                        }
                        self.hideLoading();
                    }
                },
                error: function(err) {
                    self.hideLoading();
                    var errorMsg = (err.statusText === 'timeout') ? MSG.timeoutTips : MSG.failTips;
                    //TODO: 只显示了阴影，没显示信息
                    self.showToast(errorMsg, 3, function() {}, true);
                }
            });
        }
      });
    
      return View;
});
