/**********************************
 * @author:       wjxiong@Ctrip.com
 * @description:  验证码组件
 */
define(['cWidgetFactory', 'cStorage', 'c'], function (WidgetFactory, cStorage, c) {
    "use strict";
    var WIDGET_NAME = 'Captcha';
    var Captcha = function () {
    }
    Captcha = {
        islock: false,
        getCode: function (model, self) {
            var that = this;
            if (!that.islock) {
                self.showLoading();
                this.islock = true;
                var time;
                model.excute(function (item) {
                    self.hideLoading();
                    that.islock = false;
                    if (item.rc == 0) {
                        that.islock = true;
                        //cStorage.localStorage.oldSet('VERIFYTIMEOUT', JSON.stringify({ time: time || new Date().valueOf() }));
                        that.showtime(self.els.sendcodebtn);
                    }
                    else if (item.rc == 2) {
                        item.rmsg = "很抱歉，您的验证次数已达上限，请明天再试";
                        var a = new c.ui.Alert({
                            message: item.rmsg,
                            buttons: [{
                                text: '确定',
                                click: function () {
                                    this.hide();
                                    for (var o in self.els) {
                                        var oi = self.els[o][0];
                                        if (oi && oi.nodeName == "INPUT" && !oi.disabled) {
                                            oi.value = "";
                                        }
                                    }
                                }
                            }]
                        });
                        a.show();
                    }
                    else {
                        item.rmsg = item.rmsg || "获取验证码失败，请重试";
                        self.showToast(item.rmsg);
                    }
                }, function () {
                    that.islock = false;
                    self.hideLoading();
                    self.showToast("获取验证码失败，请重试");
                });
            }
        },
        showtime: function (ele) {
            var i = 60;
            var that = this;
            if (that.islock) {
                var resource = setInterval(function () {
                    ele.addClass('cgrey');
                    ele.removeClass('cblue1');
                    ele.text(i + '秒后重发');
                    if (i <= 0 || !that.islock) {
                        clearInterval(resource);
                        ele.removeClass('cgrey');
                        ele.addClass('cblue1');
                        ele.text('免费获取');
                        that.islock = false;
                    }
                    i--;
                }, 1000);
            }
        },
        setinit: function (ele) {
            this.islock = false;
        }
    }

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: Captcha
    });
});
