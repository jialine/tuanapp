define(["libs","CommonStore","cLog"],function(a,b,c){var d=d||{};d.METHOD_ENTRY="METHOD_ENTRY",d.METHOD_MEMBER_LOGIN="METHOD_MEMBER_LOGIN",d.METHOD_NON_MEMBER_LOGIN="METHOD_NON_MEMBER_LOGIN",d.METHOD_AUTO_LOGIN="METHOD_AUTO_LOGIN",d.METHOD_LOCATE="METHOD_LOCATE",d.METHOD_REFRESH_NAV_BAR="METHOD_REFRESH_NAV_BAR",d.METHOD_CALL_PHONE="METHOD_CALL_PHONE",d.METHOD_BACK_TO_HOME="METHOD_BACK_TO_HOME",d.METHOD_BACK_TO_BOOK_CAR="METHOD_BACK_TO_BOOK_CAR",d.METHOD_BACK="METHOD_BACK",d.METHOD_COMMIT="METHOD_COMMIT",d.METHOD_REGISTER="METHOD_REGISTER",d.METHOD_LOG_EVENT="METHOD_LOG_EVENT",d.METHOD_INIT="METHOD_INIT",d.METHOD_CALL_SERVICE_CENTER="METHOD_CALL_SERVICE_CENTER",d.METHOD_BACK_TO_LAST_PAGE="METHOD_BACK_TO_LAST_PAGE",d.METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE="METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE",d.METHOD_GO_TO_HOTEL_DETAIL="METHOD_GO_TO_HOTEL_DETAIL",d.METHOD_OPEN_URL="METHOD_OPEN_URL",d.METHOD_CHECK_UPDATE="METHOD_CHECK_UPDATE",d.METHOD_RECOMMEND_APP_TO_FRIEND="METHOD_RECOMMEND_APP_TO_FRIEND",d.METHOD_ADD_WEIXIN_FRIEND="METHOD_ADD_WEIXIN_FRIEND",d.METHOD_SHOW_NEWEST_INTRODUCTION="METHOD_SHOW_NEWEST_INTRODUCTION",d.METHOD_BECOME_ACTIVE="METHOD_BECOME_ACTIVE",d.METHOD_WEB_VIEW_FINISHED_LOAD="METHOD_WEB_VIEW_FINISHED_LOAD",d.METHOD_CROSS_DOMAIN_HREF="METHOD_CROSS_DOMAIN_HREF",d.METHOD_CHECK_APP_INSTALL="METHOD_CHECK_APP_INSTALL",d.METHOD_CROSS_JUMP="METHOD_CROSS_JUMP",d.METHOD_REFRESH_NATIVE="METHOD_REFRESH_NATIVE",d.METHOD_H5_NEED_REFRESH="METHOD_H5_NEED_REFRESH",d.METHOD_READ_FROM_CLIPBOARD="METHOD_READ_FROM_CLIPBOARD",d.METHOD_COPY_TO_CLIPBOARD="METHOD_COPY_TO_CLIPBOARD",d.METHOD_SHARE_TO_VENDOR="METHOD_SHARE_TO_VENDOR",d.METHOD_DOWNLOAD_DATA="METHOD_DOWNLOAD_DATA",d.METHOD_NATIVE_LOG="METHOD_NATIVE_LOG";var e="h5_init_finished",f="member_login",g="non_member_login",h="member_auto_login",i="locate",j="back",k="commit",l="member_register",m="init_member_H5_info",n="become_active",o="web_view_finished_load",p="check_app_install_status",q="app_h5_need_refresh",r="read_copied_string_from_clipboard",s="download_data",t=!1,u={METHOD_NON_MEMBER_LOGIN:function(a){v[g]=function(d){c.applog("METHOD_NON_MEMBER_LOGIN",d),"string"==typeof d&&(d=JSON.parse(d));var e=b.UserStore.getInstance();e.getUser(),e.setUser(d.data);var f=b.HeadStore.getInstance(),g=f.get();g.auth=d.data.Auth,f.set(g),"function"==typeof a.callback&&a.callback(d)}},METHOD_LOCATE:function(a){v[i]=function(b){c.applog("METHOD_LOCATE",b);try{var d=b;"string"==typeof b&&(d=JSON.parse(b)),a.success(d)}catch(e){a.error(!0,"定位失败")}}},METHOD_MEMBER_LOGIN:function(a){v[f]=function(d){c.applog("METHOD_MEMBER_LOGIN",d),"string"==typeof d&&(d=JSON.parse(d));var e=b.UserStore.getInstance();e.getUser(),e.setUser(d.data);var f=b.HeadStore.getInstance(),g=f.get();g.auth=d.data.Auth,f.set(g),"function"==typeof a.callback&&a.callback()}},METHOD_AUTO_LOGIN:function(a){v[h]=function(d){if(c.applog("METHOD_AUTO_LOGIN",d),"string"==typeof d&&(d=JSON.parse(d)),d){var e=b.UserStore.getInstance();e.getUser(),e.setUser(d.data);var f=b.HeadStore.getInstance(),g=f.get();g.auth=d.data.Auth,f.set(g)}"function"==typeof a.callback&&a.callback(d)}},METHOD_REGISTER:function(a){v[l]=function(d){c.applog("METHOD_REGISTER",d),"string"==typeof d&&(d=JSON.parse(d));var e=b.UserStore.getInstance();e.getUser(),e.setUser(d.data);var f=b.HeadStore.getInstance(),g=f.get();g.auth=d.data.Auth,f.set(g),"function"==typeof a.callback&&a.callback()}},METHOD_ENTRY:function(a){v[e]=a.callback},METHOD_BACK:function(a){v[j]=a.callback},METHOD_COMMIT:function(a){v[k]=a.callback},METHOD_INIT:function(a){v[m]=function(d){if(c.applog("METHOD_INIT",d),"string"==typeof d&&(d=JSON.parse(d)),window.localStorage&&d){if(d&&d.userInfo)try{var e=b.UserStore.getInstance();e.getUser(),e.setUser(d.userInfo.data);var f=b.HeadStore.getInstance(),g=f.get();g.auth=d.userInfo.data.Auth,f.set(g)}catch(h){alert("set data error")}if(d&&d.device){var i={device:d.device};window.localStorage.setItem("DEVICEINFO",JSON.stringify(i))}if(d&&d.appId){var j={version:d.version,appId:d.appId,serverVersion:d.serverVersion,platform:d.platform};window.localStorage.setItem("APPINFO",JSON.stringify(j))}d&&d.timestamp&&window.localStorage.setItem("SERVERDATE",d.timestamp),d&&d.sourceId&&window.localStorage.setItem("SOURCEID",d.sourceId),d&&d.isPreProduction&&window.localStorage.setItem("isPreProduction",d.isPreProduction)}a.callback()}},METHOD_WEB_VIEW_FINISHED_LOAD:function(a){v[o]=a.callback},METHOD_BECOME_ACTIVE:function(a){v[n]=a.callback},METHOD_CHECK_APP_INSTALL:function(a){v[p]=function(b){c.applog("METHOD_CHECK_APP_INSTALL",b),a.callback(b)}},METHOD_H5_NEED_REFRESH:function(a){v[q]=a.callback},METHOD_READ_FROM_CLIPBOARD:function(a){v[r]=function(b){c.applog("METHOD_READ_FROM_CLIPBOARD",b),a.callback(b)}},METHOD_DOWNLOAD_DATA:function(a){v[s]=function(b){c.applog("METHOD_DOWNLOAD_DATA",b),"function"==typeof a.callback&&a.callback(b)}}},v={},w={h5_init_finished:function(a){"function"==typeof v[e]&&v[e](a)},non_member_login:function(a){"function"==typeof v[g]&&v[g](a)},locate:function(a){"function"==typeof v[i]&&v[i](a)},member_login:function(a){"function"==typeof v[f]&&v[f](a)},back:function(){"function"==typeof v[j]&&v[j]()},commit:function(){"function"==typeof v[k]&&v[k]()},init_member_H5_info:function(a){"function"==typeof v[m]&&v[m](a)},member_register:function(){"function"==typeof v[l]&&v[l]()},web_view_finished_load:function(){"function"==typeof v[o]&&v[o]()},become_active:function(){"function"==typeof v[n]&&v[n]()},member_auto_login:function(a){"function"==typeof v[h]&&v[h](a)},check_app_install_status:function(a){"function"==typeof v[p]&&v[p](a)},app_h5_need_refresh:function(a){"function"==typeof v[q]&&v[q](a)},read_copied_string_from_clipboard:function(a){"function"==typeof v[r]&&v[r](a)},download_data:function(a){"function"==typeof v[s]&&v[s](a)}},x={callback:function(a){if(!t){var b=a;if("string"==typeof a)try{b=JSON.parse(window.decodeURIComponent(a))}catch(c){setTimeout(function(){console.error("参数错误")},0)}return"function"==typeof w[b.tagname]?(w[b.tagname](b.param),!0):void 0}}},y=function(a){for(var b in x)a[b]=a[b]||x[b]};return d.init=function(){var a=window.app={};y(a)},d.register=function(a){"function"==typeof u[a.tagname]&&u[a.tagname](a)},d.request=function(a){var b={METHOD_INIT:function(a){d.register({tagname:d.METHOD_INIT,callback:a.callback}),CtripUtil.app_init_member_H5_info()},METHOD_ENTRY:function(){},METHOD_MEMBER_LOGIN:function(a){d.register({tagname:d.METHOD_MEMBER_LOGIN,callback:a.callback}),CtripUser.app_member_login()},METHOD_NON_MEMBER_LOGIN:function(a){d.register({tagname:d.METHOD_NON_MEMBER_LOGIN,callback:a.callback}),CtripUser.app_non_member_login()},METHOD_AUTO_LOGIN:function(a){d.register({tagname:d.METHOD_AUTO_LOGIN,callback:a.callback}),CtripUser.app_member_auto_login()},METHOD_REGISTER:function(a){d.register({tagname:d.ETHOD_REGISTER,callback:a.callback}),CtripUser.app_member_register()},METHOD_LOCATE:function(a){d.register({tagname:d.METHOD_LOCATE,success:a.success,error:a.error});var b=!0;a.isAsync&&(b=a.isAsync),CtripUtil.app_locate(b)},METHOD_REFRESH_NAV_BAR:function(a){CtripUtil.app_refresh_nav_bar(a.config)},METHOD_CALL_PHONE:function(a){CtripUtil.app_call_phone(a.tel)},METHOD_BACK_TO_HOME:function(){CtripUtil.app_back_to_home()},METHOD_BACK_TO_BOOK_CAR:function(){app_back_to_book_car()},METHOD_LOG_EVENT:function(a){CtripUtil.app_log_event(a.event_name)},METHOD_CALL_SERVICE_CENTER:function(){CtripUtil.app_call_phone()},METHOD_BACK_TO_LAST_PAGE:function(a){var b=a.param||"";CtripUtil.app_back_to_last_page(b)},METHOD_GO_TO_BOOK_CAR_FINISHED_PAGE:function(a){CtripUtil.app_go_to_book_car_finished_page(a.url)},METHOD_GO_TO_HOTEL_DETAIL:function(a){CtripUtil.app_go_to_hotel_detail(a.hotelId,a.hotelName,a.cityId,a.isOverSea)},METHOD_OPEN_URL:function(a){var b=a.title||"";CtripUtil.app_open_url(a.openUrl,a.targetMode,b)},METHOD_CHECK_UPDATE:function(){CtripUtil.app_check_update()},METHOD_RECOMMEND_APP_TO_FRIEND:function(){CtripUtil.app_recommend_app_to_friends()},METHOD_ADD_WEIXIN_FRIEND:function(){CtripUtil.app_add_weixin_friend()},METHOD_CROSS_DOMAIN_HREF:function(a){CtripUtil.app_cross_domain_href(a.moduleType,a.anchor,a.param)},METHOD_SHOW_NEWEST_INTRODUCTION:function(){CtripUtil.app_show_newest_introduction()},METHOD_CHECK_APP_INSTALL:function(a){d.register({tagname:d.METHOD_CHECK_APP_INSTALL,callback:a.callback}),CtripUtil.app_check_app_install_status(a.url,a.package)},METHOD_CROSS_JUMP:function(a){CtripUtil.app_cross_package_href(a.path,a.param)},METHOD_REFRESH_NATIVE:function(a){CtripUtil.app_refresh_native_page(a.package,a.json)},METHOD_READ_FROM_CLIPBOARD:function(a){d.register({tagname:d.METHOD_READ_FROM_CLIPBOARD,callback:a.callback}),CtripUtil.app_read_copied_string_from_clipboard()},METHOD_COPY_TO_CLIPBOARD:function(a){CtripUtil.app_copy_string_to_clipboard(a.content)},METHOD_SHARE_TO_VENDOR:function(a){CtripUtil.app_call_system_share(a.imgUrl,a.text)},METHOD_DOWNLOAD_DATA:function(a){d.register({tagname:d.METHOD_DOWNLOAD_DATA,callback:a.callback}),CtripUtil.app_download_data(a.url,a.suffix)},METHOD_NATIVE_LOG:function(a){var b=window.localStorage.getItem("isPreProduction");b&&""!=b&&CtripTool.app_log("@[Wireless H5] "+a.log,a.result)}};b[a.name](a)},d.getOpenUrl=function(a){var b="ctrip://wireless/"+a.module+"?";return _.each(a.param,function(a,c){b+=c+"="+a+"&"}),"&"===b[b.length-1]&&(b=b.slice(0,b.length-1)),b},d});