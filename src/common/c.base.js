define(["libs"],function(){function a(a,b){if(!b)return-1;if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;d>c;c++)if(b[c]===a)return c;return-1}"undefined"==typeof console&&(console={log:function(){},error:function(){}});var b=function(){},c=[].slice,d=function(a){return Object.prototype.toString.call(a)};"m.ctrip.com"==location.host&&(window.console.log=function(){}),b.Class=function(a,b){"object"==typeof a&&(b=a,a=function(){});var d,e,f,g,h,i=a.prototype,j=function(){},k=function(){this.__propertys__(),this.initialize.apply(this,arguments)};j.prototype=i,k.prototype=new j,k.prototype.constructor=a,f=k.prototype.initialize||function(){},g=b.initialize||function(){},d=k.prototype.__propertys__||function(){},e=b.__propertys__||function(){},/^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(g.toString())[1].replace(/\s/i,"").split(",");for(h in b)b.hasOwnProperty(h)&&(k.prototype[h]=b[h]);arguments.length>0&&arguments[0].prototype&&arguments[0].prototype.initialize===f&&(k.prototype.initialize=function(){var a=this,b=[function(){f.apply(a,arguments)}];g.apply(this,b.concat(c.call(arguments)))}),k.prototype.__propertys__=function(){d.call(this),e.call(this)};for(var h in a)a.hasOwnProperty(h)&&"prototype"!==h&&(k[h]=a[h]);return k},b.extend=function(){var a=c.call(arguments),b=a.shift()||{};if(!b)return!1;for(var d=0,e=a.length;e>d;d++)if("object"==typeof a[d])for(var f in a[d])b[f]=a[d][f];return b},b.implement=function(a,b){if("function"!=typeof a)return!1;for(var c in b)a.prototype[c]=b[c];return a},b.Type=function(a){return d(a)},function(a,c){for(var d=0;d<c.length;d++)a["is"+c[d]]=function(a){return function(c){return b.Type(c)==="[object "+a+"]"}}(c[d])}(b.Type,["Boolean","Object","String","Number","Date","Function","Array","Error","RegExp","Arguments"]),b.Object=new b.Class({}),b.extend(b.Object,{keys:function(a){var b=[];if("function"==typeof Object.keys)return Object.keys(a);if(a)for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}}),b.Date=new b.Class({initialize:function(a){a=a||new Date,this.date=new Date(a)},addDay:function(a){return a=a||0,this.date.setDate(this.date.getDate()+a),this},addMonth:function(a){return a=a||0,this.date.setMonth(this.date.getMonth()+a),this},addHours:function(a){return a=a||0,this.date.setHours(this.date.getHours()+a),this},addMinutes:function(a){return a=a||0,this.date.setMinutes(this.date.getMinutes()+a),this},addSeconds:function(a){return a=a||0,this.date.setSeconds(this.date.getSeconds()+a),this},addYear:function(a){return a=a||0,this.date.setYear(this.date.getFullYear()+a),this},setHours:function(){return this.date.setHours.apply(this.date,arguments),this},valueOf:function(){return this.date},getTime:function(){return this.date.valueOf()},toString:function(){return this.date.toString()},format:function(a){"string"!=typeof a&&(a="");for(var b in this._MAPS)a=this._MAPS[b].call(this,a,this.date,b);return a},diffMonth:function(a){var c=parseInt(this.format("Y")),d=parseInt(this.format("n")),e=new b.Date(a),f=parseInt(e.format("Y")),g=parseInt(e.format("n"));return 12*(f-c)+(g-d)},_DAY1:["周日","周一","周二","周三","周四","周五","周六"],_DAY2:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],_MAPS:{d:function(a,b,c){var d=b.getDate().toString();return d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},j:function(a,b,c){return a.replace(new RegExp(c,"mg"),b.getDate())},N:function(a,b,c){var d=b.getDay();return 0==d&&(d=7),a.replace(new RegExp(c,"mg"),d)},w:function(a,b,c){var d=b.getDay(),e=this._DAY1[d];return a.replace(new RegExp(c,"mg"),e)},W:function(a,b,c){var d=b.getDay(),e=this._DAY2[d];return a.replace(new RegExp(c,"mg"),e)},m:function(a,b,c){var d=(b.getMonth()+1).toString();return d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},n:function(a,b,c){return a.replace(c,b.getMonth()+1)},Y:function(a,b,c){return a.replace(new RegExp(c,"mg"),b.getFullYear())},y:function(a,b,c){return a.replace(new RegExp(c,"mg"),b.getYear())},g:function(a,b,c){var d=b.getHours();return d>=12&&(d-=12),a.replace(new RegExp(c,"mg"),d)},G:function(a,b,c){return a.replace(new RegExp(c,"mg"),b.getHours())},h:function(a,b,c){var d=b.getHours();return d>=12&&(d-=12),d+="",d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},H:function(a,b,c){var d=b.getHours().toString();return d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},i:function(a,b,c){var d=b.getMinutes().toString();return d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},s:function(a,b,c){var d=b.getSeconds().toString();return d.length<2&&(d="0"+d),a.replace(new RegExp(c,"mg"),d)},I:function(a,b,c){var d=b.getMinutes().toString();return a.replace(new RegExp(c,"mg"),d)},S:function(a,b,c){var d=b.getSeconds().toString();return a.replace(new RegExp(c,"mg"),d)},D:function(a,c,d){var e=b.getServerDate();e.setHours(0,0,0,0),c=new Date(c.valueOf()),c.setHours(0,0,0,0);var f=864e5,g="",h=c-e;return h>=0&&(f>h?g="今天":2*f>h?g="明天":3*f>h&&(g="后天")),a.replace(new RegExp(d,"mg"),g)}}}),b.extend(b.Date,{parse:function(a,c){if("undefined"==typeof a)return new Date;if("string"==typeof a){a=a||"";var d=/^(\d{4})\-?(\d{1,2})\-?(\d{1,2})/i;a.match(d)&&(a=a.replace(d,"$2/$3/$1"));var e=Date.parse(a),f=new Date(e||new Date);return c?f:new b.Date(f)}return"number"==typeof a?new Date(a):new Date},getHM:function(a){var b=this._getDate(a),c=b.getHours(),d=b.getMinutes();return(10>c?"0"+c:""+c)+":"+(10>d?"0"+d:""+d)},getIntervalDay:function(a,b){var c=this._getDate(a),d=this._getDate(b);return c.setHours(0,0,0,0),d.setHours(0,0,0,0),parseInt((d-c)/864e5)},m2H:function(a){var b=Math.floor(a/60),c=a%60;return(b>0?b+"小时":"")+(c>0?c+"分钟":"")},_getDate:function(a){var c=b.Date.parse(a,!0),d=new Date;return d.setTime(c),d},format:function(a,c){return new b.Date(a).format(c)},weekday:function(a){var b=["周日","周一","周二","周三","周四","周五","周六"],c=new Date(a);return b[c.getDay()]},diffMonth:function(a,c){var a=new b.Date(a);return a.diffMonth(c)}}),b.Hash=new b.Class({__propertys__:function(){this.keys=[],this.values=[]},initialize:function(a){"object"==typeof a&&(a={});for(var b in a)a.hasOwnProperty(b)&&(this.keys.push(b),this.values.push(a[b]))},length:function(){return this.keys.length},getItem:function(b){var c=a(b,this.keys);return 0>c?null:this.values[c]},getKey:function(a){return this.keys[a]},index:function(a){return this.values[a]},add:function(a,b){return this.push(a,b)},del:function(b){var c=a(b,this.keys);return 0>c?this:(this.keys.splice(c,1),this.values.splice(c,1),this)},delByIndex:function(a){return 0>a?this:(this.keys.splice(a,1),this.values.splice(a,1),this)},pop:function(){return this.keys.length?(this.keys.pop(),this.values.pop()):null},push:function(b,c,d){if("object"!=typeof b||c){var e=a(b,this.keys);0>e||d?(d&&this.del(b),this.keys.push(b),this.values.push(c)):this.values[e]=c}else for(var f in b)b.hasOwnProperty(f)&&this.push(f,b[f],d);return this},indexOf:function(b){var c=a(b,this.values);return c>=0?this.keys[c]:-1},shift:function(){return this.keys.length?(this.keys.shift(),this.values.shift()):null},unshift:function(b,c,d){if(Ext.isObject(b)&&!c)for(var e in b)b.hasOwnProperty(e)&&this.unshift(e,b[e]);else{var f=a(b,this.keys);0>f||d?(d&&this.del(b),this.keys.unshift(b),this.values.unshift(c)):this.values[e]=c}return this},slice:function(a,b){for(var c=this.keys.slice(a,b||null),d=this.values.slice(a,b||null),e={},f=0,g=c.length;g>f;f++)e[c[f]]=d[f];return e},splice:function(a,b){for(var c=this.keys.splice(a,b||null),d=this.values.splice(a,b||null),e={},f=0,g=c.length;g>f;f++)e[c[f]]=d[f];return e},toString:function(){return"undefined"!=typeof JSON&&JSON.stringify?JSON.stringify(this.valueOf()):typeof this.values},filter:function(a){var b={};if("function"!=typeof a)return null;for(var c=0,d=this.keys.length;d>c;c++)a.call(this.values[c],this.values[c],this.keys[c])&&(b[this.keys[c]]=this.values[c]);return b},each:function(a){if("function"!=typeof a)return null;for(var b=0,c=this.keys.length;c>b;b++)a.call(this.values[b],this.values[b],this.keys[b],b)},valueOf:function(){for(var a={},b=0,c=this.keys.length;c>b;b++)a[this.keys[b]]=this.values[b];return a},sortBy:function(a){for(var b=_.sortBy(this.values,a),c=[],d=0;d<b.length;d++){var e=this.indexOf(b[d]);c[d]=e}this.values=b,this.keys=c}}),b.getInstance=function(){return this.instance?this.instance:this.instance=new this},b.console={ENUM_LEVEL_LOG:1,ENUM_LEVEL_ERROR:4,ENUM_LEVEL_ALL:5,level:null,log:function(){this.level&this.ENUM_LEVEL_LOG&&console.log.apply(console,arguments)},error:function(){this.level&this.ENUM_LEVEL_ERROR&&console.error.apply(console,arguments)}},b.console.level=b.console.ENUM_LEVEL_ALL,window.__at=function(){var a=JSON.stringify(arguments);alert(a)};var e=function(){var a=window.localStorage.getItem("isInApp");if(a)return"1"==a?!0:!1;var b=window.localStorage.getItem("ISINAPP");return b?"1"==b?!0:!1:void 0};return b.isInApp=e,b.getServerDate=function(a){if(!e()){if(location.pathname.match(/^\/?html5/i))return a&&a(new Date),new Date;if("undefined"==typeof __SERVERDATE__||!__SERVERDATE__.server)return a&&a(new Date),new Date;var b=new Date(__SERVERDATE__.server.valueOf()+((new Date).valueOf()-__SERVERDATE__.local.valueOf()));return a&&a(b),b}var c=window.localStorage.getItem("SERVERDATE");if(!c)return a&&a(new Date),new Date;try{if(c=JSON.parse(c),c&&c.server&&c.local){var b=window.parseInt(c.server),d=window.parseInt(c.local),f=(new Date).getTime(),g=new Date(b+f-d);return a&&a(g),g}return a&&a(new Date),new Date}catch(h){return a&&a(new Date),new Date}},b});