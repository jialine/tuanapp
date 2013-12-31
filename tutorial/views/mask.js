define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('mask')], function (libs, c, pageview, cUI, html) {
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
      s = new c.ui.Mask({
        classNames: ['cui-opacitymask']
      });
      s.show();
    },

    onLoad: function () {
      this.headerview.set({
        title: 'mask组件',
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