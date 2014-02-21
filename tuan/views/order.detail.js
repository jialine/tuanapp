/**
    * @author li.xx
    * @since 20140214
    * @version 0.1
    * 订单详情页
    */
define(['libs', 'c', 'cBasePageView', 'cWidgetFactory', 'cWidgetTipslayer', 'CommonStore', 'TuanStore', 'TuanModel', TuanApp.getViewsPath('order.detail'), TuanApp.getViewsPath('order.detail.item')], function(libs, c, BasePageView, WidgetFactory, t, CStore, TStore, TModel, html, htmlItem) {
    'use strict';
    //订单详情返回页，用户Store，订单详情Store，订单详情模型，发送信息模型，提示信息
    var resultStore, userStore, detailStore, detailModel, msgModel, MSG;
    resultStore = TStore.OrderDetailReturnPage.getInstance();
    userStore = CStore.UserStore.getInstance();
    detailStore = TStore.TuanOrderDetailStore.getInstance();
    detailModel = TModel.TuanOrderDetailModel.getInstance();
    msgModel = TModel.TuanSendMsgModel.getInstance();
    MSG = {
        'unavailableOrder': '无效订单',
        'pageTitle': '订单详情',
        'timeoutTip': '非常抱歉，由于您刚才提交的服务已超时，请稍后在“我的携程”中查看订单信息或拨打服务电话400-008-6666，以确认您的订单是否提交成功。',
        'sendMsgTitle': '发送券号密码到手机',
        'sendMsg': '发送短信',
        'needOrderID': '必须选择券号哦，亲',
        'alreadySend': '券号和密码已发送至您的手机',
        'sendMsgFailed': '抱歉，发送失败！',
        'pleaseWait': '请等待',
        'sendAgain': '秒后重新发送',
        'orderPending': '正在紧张的为您处理中，请休息一下再来查看吧！'
    };
    
    var View = BasePageView.extend({
        pageid: '214018',
        hasAd: true,
        tpl: html,
        cooling: false, //是否处于冷却时间
        coolingSec: 0, //冷却剩余时间
        render: function() {
            var self = this, userInfo = userStore.getUser();
            this.orderId = parseInt(this.request.path[0]);
            //如果无法获取订单号
            if (!this.orderId) {
                this.showToast(MSG.unavailableOrder, 3, function() {
                    if (resultStore.get()) {
                        self.forward('tuanorderdetail?' + self.orderId);
                    } else {
                        if (userInfo && !userInfo.IsNonUser) {
                            //跳转到tuanorderlist
                            self.jump('/webapp/myctrip/index.html#orders/tuanorderlist');
                        } else {
                            //跳转到首页
                            self.jump('/html5', true);
                        }
                    }
                }, true);
            }
            
            //如果用户没有登陆，跳转到登陆页面
            if (!userInfo) {
                this.jump('/webapp/myctrip/#account/login?from=' +
                        encodeURIComponent(this.getRoot() + '#order.detail!' +    this.orderId ));
            }
            
            this.showLoading();
            detailStore.remove();
            detailModel.setParam({oid: this.orderId});
            detailModel.execute(function(data) {
                var store = data, isShow = false;
                this.$el.html(_.template(this.tpl, data));
                this.$date = this.$el.find('#js_validate_date');
                this.$sendBtn = this.$el.find('#js_send_msg');
                if (store.coupons && store.coupons.length) {
                    _.each(store.coupons, function(item) {
                        if (item.status == '1') {
                            isShow = true;
                        }
                    });
                    if (isShow) {
                        this.$sendBtn.show();
                    }
                    //加载券相关信息
                    this._loadCoupon(this.$date, store.coupons);
                } else {
                    if (store.status == 1 || store.status == 2) {
                        //订单处理中
                        $('<p class="fvr_ticket">' + MSG.orderPending + '</p>').insertBefore(this.$date);
                    } else if (store.status == 4) {
                        this.$sendBtn.show();
                    }
                    
                    
                    if (parseInt(store.amt) > 0) {
                        this.$sendBtn.show();
                    }
                }
                this.hideLoading();
                this._loadAlert();
                
            }, function(error) {
                this.hideLoading();
                if (error && error.statusText == 'timeout') {
                    this.showToast(MSG.timeoutTip);
                }
            }, false, this);
        },
        events: {
            'click #J_home': function() {
                var userInfo = userStore.getUser();
                //移除非会员信息
                if (userInfo && userInfo.IsNonUser) {
                    userStore.remove();
                }
                this.jump('/html5/', true);
            },
                'click #J_tuanDetail': function() {
                        var store = detailStore.get();
                        if (store) {
                                this.jump('/webapp/tuan/#tuanDetail!' + store.pid + '&from=' +
                                encodeURIComponent(this.getRoot() + '#tuanorderDetail'));
                        }
            },
            'click #J_sendMsg': 'sendMsgAction'
        },
        onCreate: function() {
            this.viewdata.req = this.request;
            this.injectHeaderView();
        },
        onLoad: function() {
            this.setTitle(MSG.pageTitle);
            this.headerview.set({
                title: MSG.pageTitle,
                back: true,
                view: this,
                tel: {number: 4000086666},
                home: true,
                events: {
                    homeHandler: function() {
                        this.jump('/html5');
                    },
                    returnHandler: function() {
                        var result = resultStore.get();
                        if (result && result.page && result.page === 'orderResult') {
                            this.forward('orderresult?' + this.orderId);
                        } else {
                            this.jump('/webapp/myctrip/#orders/tuanorderlist');
                        }
                    }
                }
            });
            
            this.headerview.show();
            this.render();
            this.turning();
        },
        onShow: function() {},
        onHide: function() {
            this.hideLoading();
        },
        _loadCoupon: function(els, data) {
            if (els[0] && data) {
                _.each(data, function(item) {
                    $(_.template(htmlItem, item)).insertBefore(els);
                });
            }
        },
        //TODO
        _loadAlert: function() {
            var self = this, htmlStr = '', $tickets, TipsLayer, sendMsgLayer;
            $tickets = this.$el.find('.ticket_no');
            _.each($tickets, function(item, index) {
                var $el = $tickets.eq(index);
                if ($el.attr('data-state') == '1') {
                    htmlStr += '<li><i class="checkbox checked code" data-code="' +
                        $el.attr('data-code') + '"></i><label for="">' +
                        $el.attr('data-code') + '</label></li>';
                }
            });
            htmlStr += '</ul></div>';
            
            TipsLayer = WidgetFactory.create('TipsLayer');
            sendMsgLayer = new TipsLayer({
                title: MSG.sendMsgTitle,
                height: 200,
                html: htmlStr,
                buttons: [{
                    text: MSG.sendMsg,
                    'click': function() {
                        self._sendMsg(this);
                        this.hide();
                    }
                    }]
            });
            this.msgBox = sendMsgLayer;
        },
        _sendMsg: function(obj) {
            var self = this, $btn, $rootList, $codeEle, phone, coupons = [];
            $btn = this.msgBox.root.find('.cui-alert-button').eq(0);
            if ($btn.hasClass('disabled')) {
                return;
            }
            
            $rootList = this.msgBox.root.find('#ticket_list');
            $codeEle = $rootList.find('i.checked');
            phone = this.$el.find('#mphone').html().trim();
            $.each($codeEle, function() {
                coupons.push({code: $(this).attr('data-code')});
            });
            if (coupons.length === 0) {
                this.showMessage(MSG.needOrderID);
                return;
            }
            //发送信息到手机
            this.msgModel.setParam({
                mphone: phone,
                coupons: coupons
            });
            
            var loadingBox = new c.ui.LoadingLayer(function() {
                self.msgModel.ajax.abort();
                this.hide();
                return;
            });
            
            loadingBox.show();
            
            this.msgModel.execute(function(data) {
                this.hideLoading();
                loadingBox.hide();
                //TODO: 需要验证返回数据类型
                if (data.res) {
                    this.cooling = true;
                    this.coolingSec = 60;
                    this._coolingTime();//开始冷却时间
                }
                this.showMessage(MSG.alreadySend);
            }, function() {
                loadingBox.hide();
                this.showToast(MSG.sendMsgFailed, 3);
                this.hideLoading();
            }, false, this, function() {
                loadingBox.hide();
                this.showToast(MSG.sendMsgFailed, 3);
                this.hideLoading();
            });
            //浏览器兼容有问题
            setTimeout(function() {
                obj.hide();
            }, 2000);
        },
        _coolingTime: function() {
            var self = this, coolingTimer;
            var func = function() {
                if (self.coolingSec > 0) {
                    self.coolingSec--;
                    self.$sendBtn.html(MSG.pleaseWait + self.coolingSec + MSG.sendAgain);
                    coolingTimer = setTimeout(function() {
                    func();
                    }, 1000);
                } else {
                    self.cooling = false;
                    self.coolingSec = 60;
                    self.$sendBtn.html(MSG.sendMsgTitle);
                }
            };
            func();
        },
        
        sendMsgAction: function() {
            if (this.cooling) {
                return;
            }
            this.msgBox.show();
            this._checkChange();
        },
        _checkChange: function() {
            var $rootList, $codeEle, $btn;
            if (!this.msgBox) {
                return;
            }
            $rootList = this.msgBox.root.find('#ticket_list');
            $codeEle = $rootList.find('.code');
            $btn = this.msgBox.root.find('.cui-btns-sure').eq(0);
            //切换勾选状态
            $codeEle.on('click', function(event) {
                var _this = $(event.target),
                method = _this.hasClass('checked') ? 'removeClass' : 'addClass';
                _this[method]('checked');
                $btn.addClass('disable_btn');
                if ($rootList.find('i.checked')[0]) {
                    $btn.removeClass('diabled_btn');
                }
            });
        }
    });
    
    return View;
});