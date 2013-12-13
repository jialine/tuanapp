define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('mask')], function(libs, c, pageview, cUI, html){
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
      var s = new c.ui.Mask({
          classNames: [  'cui-opacitymask']
      });
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