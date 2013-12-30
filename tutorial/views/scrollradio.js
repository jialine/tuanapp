define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('scrollradio')], function (libs, c, pageview, cUI, html) {
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
      var validity = this.$el.find('#input');
      var arrIndex = validity.attr('index');
      arrIndex = arrIndex ? arrIndex.split(',') : [];

      var d1 = [];
      for (var i = 0; i < 50; i++) {
        d1.push({ key: (2013 + i) });
      }

      var d2 = [];
      for (var i = 0; i < 12; i++) {
        var j = i + 1;
        if (j < 10) j = '0' + j;
        d2.push({ key: j });
      }

      s = new c.ui.ScrollRadio({
        title: '有效期',
        data: [d1, d2],
        index: arrIndex,
        okClick: function (item) {
          var t1 = item[0], t2 = item[1];
          var str = t1.key + '' + t2.key;
          var index = t1.index + ',' + t2.index;
          validity.val(str);
          validity.attr('index', index);
        }
      });
      s.show();
    },

    onLoad: function () {
      this.headerview.set({
        title: 'scrollradio组件',
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