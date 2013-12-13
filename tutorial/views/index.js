define(['libs', 'c', 'cBasePageView', getViewsPath('index')], function(libs, c, pageview, html){
  "use strict";
  var View = pageview.extend({
    render: function(){
      this.$el.html(html);
    },

    onCreate: function(){
      this.render();
    },

    events: {
    },

    onLoad: function(){
      var list = this.$el.find('#list');
      var listArr = [
          'alert',
          'headWarning',
          'inputClear',
          'loading',
          'mask',
          'scrollRadio',
          'scrollRadioList',
          'toast',
          'warning404'
      ];

      for(var i = 0, len = listArr.length; i < len; i++) {
        list.append($('<li><a href="index.html#' + listArr[i] + '">c.ui.' + listArr[i] + '</a></li>'))
      }

      this.turning();
    },

    onShow: function(){

    },

    onHide: function(){

    }

  });

  return View;

});