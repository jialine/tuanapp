define(["libs","cBase","cStorage","CommonStore","cUtility","cWidgetFactory","cWidgetGeolocation","cWidgetGuider","cGeoService"],function(a,b,c,d,e,f){var g={},h=f.create("Geolocation"),i=f.create("Guider"),j=h.PositionStore.getInstance();return g.GeoLocation=function(){function a(a,b,c){for(var d in f)f[d]&&"function"==typeof f[d][a]&&f[d][a].apply(f[d].scope,b);c&&(f={})}var b=0,c=1,d=2,e=3,f={},g=b,k=null;return{Subscribe:function(b,l,m,n){l=l||{},f[b]||(f[b]={name:b,onStart:l.onStart,onComplete:l.onComplete,onError:l.onError,onPosComplete:l.onPosComplete,onPosError:l.onPosError,scope:m});var o=j.get();if(n&&(o=null),o)g=c,a("onStart",null),g=d,a("onPosComplete",[o.lng,o.lat]),a("onComplete",[o],!0);else{if(clearTimeout(k),k=setTimeout(function(){g===c&&(g=e,i.print({log:"#cGeoService -- 22 second timeout call onError"}),a("onError",[null],!0))},35e3),g===c)return f[b]&&"function"==typeof f[b].onStart&&f[b].onStart.call(m),void 0;g=c,a("onStart",null),i.print({log:"#cGeoService -- start request city info"}),h.requestCityInfo(function(b){g=d,j.set(b),a("onComplete",[b],!0)},function(b,c){g=e,"number"==typeof c&&2===c&&(c={code:1}),i.print({log:"#cGeoService -- locate onError"}),a("onError",[b,c],!0)},function(b,c){a("onPosComplete",[b,c])},function(b,c){g=e,"number"==typeof c&&2===c&&(c={code:1}),a("onPosError",[b,c],!0)},!0)}},UnSubscribe:function(a){a=_.isArray(a)?a:[a];for(var b=0;b<a.length;b++)delete f[a[b]]},ClearPosition:function(){j.remove()}}}(),g.GeoAround=function(){return{Subscribe:function(a,b,c,d){h.requestAroundInfo(a,function(a){b.call(d,a)},function(){c.call(d)})}}}(),g.GeoKeyword=function(){return{Subscribe:function(a,b,c,d,e){h.requestKeywordInfo(a,b,function(a){c.call(e,a)},function(){d.call(e)})}}}(),g});