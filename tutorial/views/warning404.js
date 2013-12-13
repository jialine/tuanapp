define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('warning404')], function(libs, c, pageview, cUI, html){
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
          var warning404 = new c.ui.Warning404();
          warning404.retryClick(function () {
              this.hide();
          });
          warning404.show();
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