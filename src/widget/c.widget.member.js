define(["cUtility","cWidgetFactory","cHybridFacade"],function(a,b,c){"use strict";var d="Member",e={MEMBER_LOGIN:"/webapp/myctrip/#account/login",NON_MEMBER_LOGIN:"/webapp/myctrip/#account/login",REGISTER:"/webapp/myctrip/#account/reg"},f=function(a,b){window.location.href=b&&b.param&&"string"==typeof b.param?a+"?"+b.param:a},g={memberLogin:function(a){f(e.MEMBER_LOGIN,a)},nonMemberLogin:function(a){f(e.NON_MEMBER_LOGIN,a)},register:function(a){f(e.REGISTER,a)},autoLogin:function(){return!1}},h={memberLogin:function(a){c.request({name:c.METHOD_MEMBER_LOGIN,callback:a.callback})},nonMemberLogin:function(a){c.request({name:c.METHOD_NON_MEMBER_LOGIN,callback:a.callback})},register:function(a){c.request({name:c.METHOD_REGISTER,callback:a.callback})},autoLogin:function(a){c.request({name:c.METHOD_AUTO_LOGIN,callback:a.callback})}};b.register({name:d,fn:a.isInApp()?h:g})});