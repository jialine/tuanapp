define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('scrollRadioList')], function(libs, c, pageview, cUI, html){
  "use strict";

  var s = null;
  var View = pageview.extend({
    render: function(){
      this.injectHeaderView();
      this.$el.html(html);
    },

    onCreate: function(){
      this.render();
    },

    events: {
      'click #test': 'testAction'
    },

      testAction: function(){
          var port_place = this.$el.find('#input');
          var data = [];
          for (var i = 0; i < 3; i++) {
              data.push({ key: '列表选项' + (i + 1) });
          }

          s = new c.ui.ScrollRadioList({
              title: '列表选项',
              index: port_place.attr('index'),
              data: data,
              itemClick: function (item) {
                  port_place.attr('index', item.index);
                  port_place.val(item.key);
              }
          });
          s.show();
    },

        onLoad: function () {
          this.headerview.set({
            title: 'scrollRadioList组件',
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

    onShow: function(){

    },

    onHide: function(){

    }

  });

  return View;

});