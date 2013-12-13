define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('scrollRadioList')], function(libs, c, pageview, cUI, html){
  "use strict";

  var View = pageview.extend({
    render: function(){
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

          var r = new c.ui.ScrollRadioList({
              title: '列表选项',
              index: port_place.attr('index'),
              data: data,
              itemClick: function (item) {
                  port_place.attr('index', item.index);
                  port_place.val(item.key);
              }
          });
          r.show();
    },

    onLoad: function(){
      this.turning();
    },

    onShow: function(){

    },

    onHide: function(){

    }

  });

  return View;

});