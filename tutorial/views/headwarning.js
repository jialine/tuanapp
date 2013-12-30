define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('headwarning')], function (libs, c, pageview, cUI, html) {
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
      s = new cUI.HeadWarning()
      s.setTitle('测试', '内容', function () {
        alert('尼玛');
      });
      s.show();
    },

    onLoad: function () {
      this.headerview.set({
        title: 'headwarning组件',
        back: true,
        view: this,
        tel: null,
        events: {
          returnHandler: function () {
            this.back('index');
            if(s) s.hide();
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