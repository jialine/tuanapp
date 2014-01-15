"user strict"

define(['lib', 'cWidgetFactory', 'cWidgetGuider'], function(lib, WidgetFactory){

  var WIDGET_NAME = 'ChannelAd';

  var Guider = WidgetFactory.create('Guider');

  var template = '<div data-hash="market" id="adview" data-link="<%=link%>" data-title="<%=title%>" data-type="<%=type%>"><img id="carbar-img" src="<%=img%>" style="width: 100%; cursor: pointer; height: auto;"></div>';
  var templateFn = _.template(template);

  function ChannelAd (config) {
    // @description 缺少关键参数直接返回
    if (!config || !config.channel) return false;

    var setting = {};

    var appChannel = 'ad_'+config.channel;
    if (AppConfigMap && AppConfigMap[appChannel]) {

      if (typeof AppConfigMap[appChannel] === 'string') {
        try{
          AppConfigMap[appChannel] = JSON.parse(AppConfigMap[appChannel]);
        }catch(e){

        }
      };

      setting.link = AppConfigMap[appChannel].link || config.link;
      setting.img = AppConfigMap[appChannel].img || config.img;
      setting.title = AppConfigMap[appChannel].title || config.title;
      setting.type = AppConfigMap[appChannel].type || config.type;
    }

    var callback = function (e) {
      var link = $(e.currentTarget).data('link');
      var title = $(e.currentTarget).data('title');
      var type = $(e.currentTarget).data('type');

      var fn = {
        'app': function () {
          Guider.jump({ targetModel: 'app', url: link, title: title });
        },
        'browser': function () {
          Guider.jump({ targetModel: 'browser', url: link, title: title });
        },
        'h5': function () {
          Guider.jump({ targetModel: 'h5', url: link, title: title });
        }
      }

      if (type)
        fn[type]();
      else
        Guider.jump({ targetModel: 'h5', url: link, title: title });
    }

    var html = templateFn(setting);
    this.$el = $(html);
    this.$el.on('click', callback);
  }


  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: ChannelAd
  });

});