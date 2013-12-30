define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('alert')], function (libs, c, pageview, cUI, html) {
  "use strict";
  var s = null;

  var View = pageview.extend({
    render: function () {
      this.$el.html(html);
    },

    onCreate: function () {
      this.injectHeaderView();

      this.render();
    },

    events: {
      'click #test': 'testAction'
    },

    testAction: function () {
      s = new c.ui.Alert({
        title: '提示信息',
        message: '测试信息',
        buttons: [{
          text: '知道了',
          click: function () {
            this.hide();
          }
        }]
      });
      s.show();
    },

    onLoad: function () {
      //对HeaderView设置数据
      this.headerview.set({
        title: 'alert组件',
        back: true,
        view: this,
        tel: null,
        events: {
          returnHandler: function () {
            this.back('index');
            if (s) s.hide();
          }
        }
      });
      this.headerview.show();

      this.turning();
    },

    onShow: function () {

    },

    onHide: function () {

    }

  });

  return View;

});