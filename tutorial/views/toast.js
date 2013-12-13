define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('toast')], function(libs, c, pageview, cUI, html){
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
          var loading = new c.ui.Toast();
          loading.show('测试', 2, function () {
              alert('尼玛');
          }, true);
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