define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('toast')], function (libs, c, pageview, cUI, html) {
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
      s = new c.ui.Toast();
      s.show('尼玛', 2, function () {
        alert('尼玛');
      }, true);
    },

    onLoad: function () {

      //对HeaderView设置数据
      this.headerview.set({
        title: 'toast组件',
        back: true,
        view: this,
        tel: null,
        events: {
          returnHandler: function () {
            this.back('index');
            s.hide();
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