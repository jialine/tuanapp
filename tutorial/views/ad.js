define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('ad')], function(libs, c, pageview, cUI, html){
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
      var s = c.ui.cAdView.getInstance();
        s.show();
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