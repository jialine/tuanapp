define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('loading')], function (libs, c, pageview, cUI, html) {
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
      'click #c-ui-btn-loading': 'showLoading'
    },

    showLoading: function () {
      s = new cUI.Loading();
      s.show();
      setTimeout(function () {
        s.hide();
      }, 10000);
    },

    onLoad: function () {
      this.headerview.set({
        title: 'loading组件',
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