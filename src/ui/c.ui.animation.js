/**
* @author zsb张淑滨 <shbzhang@Ctrip.com> / ghj龚汉金 <hjgong@Ctrip.com>
* @class cLog
* @description 提供App在手机端的后门
* @comment 需要zsb与新代码再核对一遍
*/
define([], function () {

  return {
    /**
    * @method slideleft
    * @param {c.ui.view} inView 切入的view
    * @param {c.ui.view} outView 切出的view
    * @param {function} callback 回调函数
    * @param {c.ui.app} scope 作用域
    * @description 左滑动
    */
    slideleft: function (inView, outView, callback, scope) {
      inView.addClass('animatestart');
      inView.addClass('sliderightin');

      inView.__show();

      var self = this;
      return setTimeout(function () {
        inView.removeClass('animatestart');
        inView.removeClass('sliderightin');

        if (outView) { outView.__hide(); outView.__onHide(inView.viewname); }
        inView.__onShow();

        callback && callback.call(scope, inView, outView);
      }, 340);
    },

    /**
    * @method slideright
    * @param {c.ui.view} inView 切入的view
    * @param {c.ui.view} outView 切出的view
    * @param {function} callback 回调函数
    * @param {c.ui.app} scope 作用域
    * @description 右滑动
    */
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
          outView.__onHide(inView.viewname);
        }
        inView.__onShow();

        callback && callback.call(scope, inView, outView);

      }, 340);
    },

    /**
    * @method noAnimate
    * @param {c.ui.view} inView 切入的view
    * @param {c.ui.view} outView 切出的view
    * @param {function} callback 回调函数
    * @param {c.ui.app} scope 作用域
    * @description 无动画
    */
    noAnimate: function (inView, outView, callback, scope) {
      //减少重绘和回流
      this.mainframe.hide();

      //in 一定会有 out则不一定
      if (outView) { outView.__hide(); outView.__onHide(inView.viewname); }
      inView.__show();
      inView.__onShow();

      this.mainframe.show();

      callback && callback.call(scope, inView, outView);

    }

  };
});