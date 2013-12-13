define(['libs', 'c', 'cBasePageView', 'cUI', getViewsPath('inputClear')], function(libs, c, pageview, cUI, html){
  "use strict";

  var View = pageview.extend({
    render: function(){
      this.$el.html(html);
    },

    onCreate: function () {
      this.injectHeaderView();

      this.render();
    },

    events: {
      'click #test': 'testAction'
    },

      testAction: function(){
          c.ui.InputClear(this.$el.find('#input'));
    },

        onLoad: function () {
          this.headerview.set({
            title: 'inputClear组件',
            back: true,
            view: this,
            tel: null,
            events: {
              returnHandler: function () {
                this.back('index');
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