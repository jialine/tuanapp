define(['libs', 'c', 'cBasePageView', 'cUI', 'text!tutorial/case.ui.loading/caseUiLoading.html'], function(libs, c, pageview, cUI, html){
  "use strict";

  var View = pageview.extend({
    render: function(){
      this.$el.html(html);
    },

    onCreate: function(){
      this.render();
    },

    events: {
      'click #c-ui-btn-loading': 'showLoading'
    },

    showLoading: function(){
      var loading = new cUI.Loading();
      loading.show();

      setTimeout(function() {
        loading.hide();
      }, 10000);
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