define(['libs', 'c', 'cBasePageView'], function(libs, c, pageview, html){
  "use strict";

  var View = pageview.extend({
    render: function(){
      this.$el.html(html);
    },

    onCreate: function(){

    },

    onLoad: function(){
      $('#c-ui-btn-loading').on('click', function(e){
        alert('show');
      });
    },

    onShow: function(){

    },

    onHide: function(){

    }

  });

  return View;

});