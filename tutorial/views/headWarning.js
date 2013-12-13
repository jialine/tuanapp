define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('headWarning')], function(libs, c, pageview, cUI, html){
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
          var a = new cUI.HeadWarning()
          a.setTitle('测试', '内容', function () {
              alert('尼玛');
          });
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