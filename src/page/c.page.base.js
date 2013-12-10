define(['libs','c', 'cWidgetFactory', 'cWidgetHeaderView', 'cWidgetGuider'], function(libs, c, WidgetFactory){
  "use strict";

  var Guider = WidgetFactory.create('Guider');
  var options = options || {};

  /********************************
   * @description: 向PageView注入HeaderView实例
   */
  options.injectHeaderView = function(data){
    var HeaderView = WidgetFactory.create('HeaderView');
    this.headerview = new HeaderView(data);
    //this.$el.append(this.headerview.getView());
    $('#main').before(this.headerview.getView());
  };

  // 复写c.view对于header的设置，去除过去设置对于现在的控件影响
  options._initializeHeader = function(){};
  options._getDefaultHeader = function(){};

  // @deprecated
  //options.registerCallback = function(callback, timeout){
    //timeout =  timeout ? timeout:400;
    //var self = this;
    //var Publisher = WidgetFactory.create('Publisher');

    //Publisher.register({
    //  name: 'login',
    //  success: function(){
    //    setTimeout(function() { callback(); }, timeout);
    //  }
    //});
  //};

  options.hybridBridgeRender = function () {
    //------------------------
    // @author Michael.Lee
    // 在渲染页面之前，App环境和Web环境不同的处理。对所有App跳转H5的页面都要用callAppInit去初始化参数

    var self = this;
    //var Guider = widgetFactory.create('Guider');

    //var hybridCallback = function () {
    //  self.callAppInit($.proxy(self.showView, self));
    //};
    var hybridCallback = $.proxy(self.showView, self);
    var callback = $.proxy(self.showView, self);

    Guider.apply({
      hybridCallback: hybridCallback,
      callback: callback
    });
    //-------------------------  
  };

  options.registerCallback = function (callback) {
    //var Guider = WidgetFactory.create('Guider');
    //Guider.register({ tagname: 'METHOD_BECOME_ACTIVE', callback: callback });
  };

  options.callAppInit = function (callback) {
    var version = 0;
    if (window.localStorage) {
      var appInfo = window.localStorage.getItem('APPINFO');

      appInfo = JSON.parse(appInfo);
      if(appInfo) version = appInfo.version;
    }
    Guider.init({version: version, callback: callback});
  };

  var BasePageView = c.view.extend(options);

  //定义点击事件名
  BasePageView.ONCLICK = 'click';

  return BasePageView;

  // ----------------------------------------------------------------- //
  // 使用方法
  //
  //  var View = BasePageView.extend({
  //    onCreate: function(){
  //       this.injectHeaderView();
  //    },
  //    onLoad: function(){
  //       需要HeaderView的数据
  //       this.headerview.set(data);
  //       this.headerview.show();
  //    }
  //  });
  //  在onCreate中显示的调用injectHeaderView，这里可以传递数据，如果这里传递了数据，那么onLoad那里去set数据就不需要了
  //  在onLoad或者加载完数据开始渲染画面的时候调用this.headerview.set(data)都可以
  // ----------------------------------------------------------------- //

});