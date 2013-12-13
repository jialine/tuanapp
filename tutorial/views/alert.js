define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('alert')], function(libs, c, pageview, cUI, html){
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
          var a = new c.ui.Alert({
              title: '提示信息',
              message: '测试信息',
              buttons: [{
                  text: '知道了',
                  click: function () {
                      this.hide();
                  }
              }]
          });
          var s = '';
          a.show();
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