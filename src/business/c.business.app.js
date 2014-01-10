define(['libs', 'cBase', 'AbstractAPP', 'cWidgetFactory', 'cWidgetGuider'], function (libs, cBase, AbstractAPP, WidgetFactory) {

  var Appliction = new cBase.Class(AbstractAPP, {
    __propertys__: function () {
      
    },
    initialize: function ($super, options) {

      $super(options);

      //适配app 张爸爸
      var Guider = WidgetFactory.create('Guider');
      Guider.create();

      //l_wang提升响应速度
      $.bindFastClick && $.bindFastClick();

    }

  });
  return Appliction;
});
