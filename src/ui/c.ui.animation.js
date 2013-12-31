define([],
function () {

    return {
        //        slideleft: function (inView, outView, callback, scope) {
        //            this.body.addClass('hiddenx');
        //            inView.$el.addClass('animatestart');
        //            outView.$el.addClass('slideleftout');
        //            inView.$el.addClass('sliderightin');
        //            var self = this;
        //            return setTimeout(function () {
        //                self.body.removeClass('hiddenx');
        //                inView.$el.removeClass('animatestart');
        //                inView.$el.removeClass('sliderightin');
        //                inView.$el.show();
        //                outView.$el.removeClass('slideleftout');
        //                outView.$el.hide();
        //                callback && callback.call(scope);
        //            }, 700);
        //        },
        //        slideright: function (inView, outView, callback, scope) {
        //            this.body.addClass('hiddenx');
        //            inView.$el.addClass('animatestart');
        //            outView.$el.addClass('sliderightout');
        //            inView.$el.addClass('slideleftin');
        //            var self = this;
        //            return setTimeout(function () {
        //                self.body.removeClass('hiddenx');
        //                inView.$el.removeClass('animatestart');
        //                inView.$el.removeClass('slideleftin');
        //                inView.$el.show();
        //                outView.$el.removeClass('sliderightout');
        //                outView.$el.hide();
        //                callback && callback.call(scope);
        //            }, 700);
        //        },

        //以下为复写
        //                slideleft: function (inView, outView, callback, scope) {
        //                    this.body.addClass('hiddenx');
        //                    var self = this;
        //                    inView.$el.addClass('animatestart');
        //                    inView.$el.css({
        //                        '-webkit-transform': 'translate3d(100%, 0px, 0px)',
        //                        '-moz-transform': 'translate3d(100%, 0px, 0px)'
        //                    });

        //                    inView.$el.animate({
        //                        '-webkit-transform': 'translate3d(0px, 0px, 0px)',
        //                        '-moz-transform': 'translate3d(0px, 0px, 0px)'
        //                    }, 300, 'linear', function () {
        //                        self.body.removeClass('hiddenx');
        //                        inView.$el.removeClass('animatestart');
        //                        outView.$el.hide();
        //                        callback && callback.call(scope);
        //                    })
        //                },
        //                slideright: function (inView, outView, callback, scope) {
        //                    this.body.addClass('hiddenx');
        //                    var self = this;
        //                    outView.$el.addClass('animatestart');
        //                    outView.$el.css({
        //                        '-webkit-transform': 'translate3d(0%, 0px, 0px)',
        //                        '-moz-transform': 'translate3d(0%, 0px, 0px)'
        //                    });
        //                    outView.$el.animate({
        //                        '-webkit-transform': 'translate3d(100%, 0px, 0px)',
        //                        '-moz-transform': 'translate3d(100%, 0px, 0px)'
        //                    }, 300, 'linear', function () {
        //                        self.body.removeClass('hiddenx');
        //                        outView.$el.removeClass('animatestart');
        //                        outView.$el.hide();
        //                        callback && callback.call(scope);
        //                    });
        //                },

//        slideleft: function (inView, outView, callback, scope) {
//            this.body.addClass('hiddenx');
//            inView.$el.addClass('animatestart');
//            inView.$el.addClass('sliderightin');

//            outView.$el.addClass('animatestart');
//            outView.$el.addClass('slideleftout');

//            var self = this;
//            return setTimeout(function () {
//                self.body.removeClass('hiddenx');
//                inView.$el.removeClass('animatestart');
//                inView.$el.removeClass('sliderightin');

//                outView.$el.removeClass('animatestart');
//                outView.$el.removeClass('slideleftout');

//                outView.$el.hide();
//                callback && callback.call(scope);
//            }, 390);
//        },

//        slideright: function (inView, outView, callback, scope) {
//            this.body.addClass('hiddenx');
//            inView.$el.addClass('animatestart');
//            inView.$el.addClass('slideleftin');

//            outView.$el.addClass('animatestart');
//            outView.$el.addClass('sliderightout');

//            var self = this;
//            return setTimeout(function () {
//                self.body.removeClass('hiddenx');
//                inView.$el.removeClass('animatestart');
//                inView.$el.removeClass('slideleftin');

//                outView.$el.removeClass('animatestart');
//                outView.$el.removeClass('sliderightout');

//                outView.$el.hide();
//                callback && callback.call(scope);
//            }, 390);
//        },

        slideleft: function (inView, outView, callback, scope) {
            inView.$el.addClass('animatestart');
            inView.$el.addClass('sliderightin');
            var self = this;
            return setTimeout(function () {
                inView.$el.removeClass('animatestart');
                inView.$el.removeClass('sliderightin');
                outView.$el.hide();
                callback && callback.call(scope);
              }, 340);
        },
        slideright: function (inView, outView, callback, scope) {

            outView.$el.addClass('animatestart');
            outView.$el.addClass('sliderightout');

            var self = this;
            return setTimeout(function () {
                outView.$el.removeClass('animatestart');
                outView.$el.removeClass('sliderightout');
                outView.$el.hide();

                callback && callback.call(scope);
            }, 340);
        },

        fadeIn: function (inView, outView, callback, scope) {
            this.mainframe.hide();
            //原逻辑存在两个view可能同时出现在页面中的bug，这里强制先将所有view隐藏，在显示当前view
            this.viewport.children('.sub-viewport').hide();
            inView.$el.show();
            this.mainframe.show();
            callback && callback.call(scope || this);
        }
    };
});