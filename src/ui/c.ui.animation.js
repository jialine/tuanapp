define([],
    function () {

        return {
            slideleft: function (inView, outView, callback, scope) {
                inView.addClass('animatestart');
                inView.addClass('sliderightin');

                inView.__show();

                var self = this;
                return setTimeout(function () {
                    inView.removeClass('animatestart');
                    inView.removeClass('sliderightin');

                    if (outView) outView.__hide();

                    callback && callback.call(scope, inView, outView);
                }, 340);
            },
            slideright: function (inView, outView, callback, scope) {

                if (outView) {
                    outView.addClass('animatestart');
                    outView.addClass('sliderightout');
                }

                inView.__show();

                var self = this;
                return setTimeout(function () {

                    if (outView) {
                        outView.removeClass('animatestart');
                        outView.removeClass('sliderightout');
                        outView.__hide();
                    }

                    callback && callback.call(scope, inView, outView);

                }, 340);
            },


            noAnimate: function (inView, outView, callback, scope) {
                //减少重绘和回流
                this.mainframe.hide();

                //in 一定会有 out则不一定
                if (outView) outView.__hide();
                inView.__show();

                this.mainframe.show();

                callback && callback.call(scope, inView, outView);

            }

        };
    });