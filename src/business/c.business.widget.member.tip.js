"user strict"

define(['lib', 'cWidgetFactory'], function(lib, WidgetFactory){

  var WIDGET_NAME = 'MemberTip';


  var map = {
    'login': '<div class="loginTips"><button class="loginNow"><%=btnContent%></button><%=alertInfo%></div>',
    'register': '<section class="novip" id="sigin-up-area" style=""><span class="btn" id="sigin-up-now"><%=btnContent%></span><p class="p10 cgray"><%=alertInfo%></p></section>'
  }

  var urlMap = {
    'register': 'http://m.ctrip.com/webapp/myctrip/#account/reg',
    'login': 'http://m.ctrip.com/webapp/myctrip/#account/login?t=0'
  }

  var el = {
    'login': 'button.loginNow',
    'register': 'button#sigin-up-now'
  }



  // @description default setting
  var setting = {
    btnContent: '立即注册',
    alertInfo: '仅需一步，注册携程会员，即可享受1000积分和800携程消费券。'
  }


  // @param config {JSON} {mode: 'login|register', url: url, btnContent: btnname, alertInfo: alertinfo}
  // @description 生成MemberTip组件
  function MemberTip (config) {

    if (!config || !config.mode) return;

    var templateFn = null;
    if (map.hasOwnProperty(config.mode)) templateFn = _.template(map[config.mode]);

    var url = urlMap[config.mode];

    // @description 使用用户配置替换默认配置
    if (config) {
      setting.btnContent = config.btnContent || setting.btnContent;
      setting.alertInfo = config.alertInfo || setting.alertInfo;

      url = config.url || url;
    }

    // @description 使用服务端下发的配置替换默认配置
    if (AppConfigMap && AppConfigMap[mode]) {
      if (typeof AppConfigMap[mode] === 'string') {
        try{
          AppConfigMap[mode] = JSON.parse(AppConfigMap[mode]);
        }catch(e){

        }
      };

      setting.btnContent = AppConfigMap[mode].btn || setting.btnContent;
      setting.alertInfo = AppConfigMap[mode].text || setting.alertInfo;
    }

    var html = templateFn(setting);

    this.$el = $(html);

    var callback = function(){
      window.location.href = url;
    }

    this.$el.find(el[config.mode]).on(click, callback);
  }

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: MemberTip
  });
});