/**
  * @author li.xx
  * @since 20140214
  * @version 0.1
  * 订单完成页面
  */
define(['libs', 'TuanStore', 'c', 'TuanModel', 'CommonStore',TuanApp.getViewsPath('booking.success')], function(libs, TStore, c, TModel, CStore, html) {
    'use strict';
    
    //返回目标页面, 订单号, 团购订单列表, 订单详情Model, 用户相关, 提示信息
    var resultStore, orderId, listStore, detailModel, userStore, MSG;
    resultStore = TStore.OrderDetailReturnPage.getInstance();
    listStore = TStore.TuanOrderListStore.getInstance();
    detailModel = TModel.TuanOrderDetailModel.getInstance();
    userStore = CStore.UserStore.getInstance();
    MSG = {
        pageTitle: '订单完成',
        warningTip: '没有检索到数据!',
        needLoginTip: '需要先登录才能查看订单信息'
    };
    
    
    var View = c.view.extend({
        pageid: '214016',
        hasAd: true,
        tpl: html,
        //是否第一次进入此界面
        isFirstIn: true,
        //当前位置的经纬度
        latlon: null,
        render: function() {
            var self = this, user, param = {}, id, tpl;
            this.user = user = userStore.getUser();
            id = parseInt(this.request.path[0]);
            orderId = id;
            param.oid = id;
            this.id = id;
            param.auth = user ? user.Auth : '';
            tpl = _.template(this.tpl);
            detailModel.setParam(param);
            if (id && id > 0) {
                detailModel.execute(function(data) {
                    if (data) {
                        if (!data.oid) {
                            self.showHeadWarning(MSG.pageTitle, MSG.warningTip, function() {
                                self.forward('list');
                                this.hide();
                            });
                            return;
                        }
                        data.user = this.user;
                        this.$el.html(tpl(data));
                    }
                }, function() {
                    this.showToast(MSG.needLoginTip, 3, function() {
                        self.redirectToLogin();
                    }, true);
                    return;
                }, true, this);
            } else {
                //TODO: 测试数据
                var data = {
                    user: {IsNonUser: true},
                    oid: 1,
                    amt: 1000,
                    pname: 'test'
                };
                this.$el.html(tpl(data));
            }
        
        },
        events: {
            'click #J_return': function() {
                this.forward('list');
            },
            'click #J_home': 'redirectToIndex',
            'click #J_orderDetail': 'viewOrderDetail',
            'click #J_registerBtn': 'redirectToRegister'
            
        },
        onCreate: function() {
            this.viewdata.req = this.request;
        },
        onLoad: function() {
            this.updateHeader({title: MSG.pageTitle});
            this.render();
            this.turning();
            listStore.remove();
        },
        onShow: function() {},
        onHide: function() {},
        //TODO: Not very good.
        redirectToIndex: function() {
            var loc = window.location;
            window.location.href = loc.protocol + '//' + loc.hostname + '/html5';
        },
        viewOrderDetail: function() {
            var userInfo = userStore.getUser();
            if (this.id && userInfo && userInfo.Auth) {
                //记录用户选择的订单号
                this.showLoading();
                var data = {
                    Id: this.id,
                    page: 'booking.success'
                };
                resultStore.set(data);
                //TODO: 跳转到详情页面
                window.location.href = location.origin + '/webapp/tuan/#order.detail!' + this.id;
            }
            //测试数据
            window.location.href = location.origin + '/tuan/index.html#order.detail!10086';
        },
        //TODO: 跳转到注册页面
        redirectToRegister: function() {
            this.showLoading();
            window.location.href = '/webapp/myctrip/index.html#account/reg';
        },
        //TODO: 跳转到登陆页面，登陆成功后跳转回来
        redirectToLogin: function() {
            window.location.href = '/webapp/myctrip/#account/login?from=' + encodeURIComponent(this.getRoot() + '#booking.success?' + orderId);
        }
    });
    
    return View;
});