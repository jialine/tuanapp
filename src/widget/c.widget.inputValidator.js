define(["cBase","cUICore","cWidgetFactory","Validate","libs"],function(cBase,cUICore,WidgetFactory,validate){"use strict";var WIDGET_NAME="InputValidator";if(!WidgetFactory.hasWidget(WIDGET_NAME)){var InputValidator=new cBase.Class(cUICore.Layer,{__propertys__:function(){this.TypeMsg={idCard:"身份证格式错误",num:"不是数字",email:"email格式错误",phone:"手机格式错误",chinese:"不是中文",password:"密码格式错误"},this.validatorArr={}},initialize:function(a,b){b=b||{},a(b),this.requredMsg=b.requredMsg||"该项必填",this.rangeMsg=b.rangeMsg||"您输入的字符范围错误",this.regexMsg=b.regexMsg||"格式错误",this.compareMsg=b.compareMsg||"对比不成立",this.els=b.els||$(".formValidate"),this.msgPosition=b.msgPosition||"bottom",this.isShowMsg=b.isShowMsg||!1,this.init()},init:function(){for(var a=0,b=this.els.length;b>a;a++){var c=$(this.els[a]);this.initItem(c)}},initItem:function(el,insertType){var scope=this;"string"==typeof el&&(el=$("#"+el));var cfg=el.attr("data-cfg");if(!cfg||0==cfg.length)return!1;if(cfg=eval("("+cfg+")"),cfg.check!==!1&&(cfg.check=!0),insertType&&(cfg.check=!0),cfg.check===!1)return!1;cfg.id=el.attr("id")||"_"+Math.random(),cfg.el=el,cfg.validate=function(){scope.funcValidate(cfg)},this.validatorArr[cfg.id]=cfg;var s=""},validate:{requred:function(a){return""==a?!1:!0},regex:function(a,b){return b.test(a)?!0:!1},range:function(a,b){var c=b.split("|");return 3!=c.length?(console.log("范围参数错误"),!1):this["_"+c[0]](a,c[1],c[2])},_num:function(a,b,c){return a=parseInt(a),a>b&&c>a?!0:!1},_str:function(a,b,c){return a.length>b&&a.length<c?!0:!1},_date:function(){return!0},compare:function(a,b){var c=b.split("|");return 3!=c.length?(console.log("范围参数错误"),!1):this["_c"+c[0]](a,$("#"+c[1]).val(),c[2])},_cnum:function(a,b,c){if(a=parseInt(a),b=parseInt(b),"<"==c){if(b>a)return!0}else if("="==c){if(a==b)return!0}else if(">"==c&&a>b)return!0;return!1},_cstr:function(a,b,c){if(a=a.length,b=b.length,"<"==c){if(b>a)return!0}else if("="==c){if(a==b)return!0}else if(">"==c&&a>b)return!0;return!1},_cdate:function(){return!0}},funcValidate:function(a){if(void 0===this.validatorArr[a.id])return!1;var b=a.el.val()||a.el.html().replace(/(^\s*)|(\s*$)/g,""),c={};if(c.isPass=!0,c.el=a.el,c.id=a.id,c.errorItem={},this.validatorArr[a.id].check===!1)return this.validatorArr[a.id].result=c,!1;if(a.requred&&(c.errorItem.requred=this.validate.requred(b),c.errorItem.requred===!0?c.isPass=!0:(c.isPass=!1,c.msg=this.requredMsg)),c.isPass&&"string"==typeof a.type&&""!=b){var d=a.type;d="is"+d.substr(0,1).toUpperCase()+d.substr(1,d.length),c.errorItem[a.type]=validate[d](b),c.errorItem[a.type]===!0?c.isPass=!0:(c.isPass=!1,c.msg=this.TypeMsg[a.type]||"格式错误")}c.isPass&&a.regexObj&&""!=b&&(c.errorItem.regex=this.validate.regex(b,a.regexObj),c.errorItem.regex===!0?c.isPass=!0:(c.isPass=!1,c.msg=a.errorMsg||this.regexMsg)),c.isPass&&a.rangeObj&&""!=b&&(c.errorItem.range=this.validate.range(b,a.rangeObj),c.errorItem.range===!0?c.isPass=!0:(c.isPass=!1,c.msg=a.errorMsg||this.rangeMsg)),c.isPass&&a.compareObj&&""!=b&&(c.errorItem.compare=this.validate.compare(b,a.compareObj),c.errorItem.compare===!0?c.isPass=!0:(c.isPass=!1,c.msg=a.errorMsg||this.compareMsg)),this.validatorArr[a.id].result=c},showMsg:function(a){this.msgTimer&&clearTimeout(this.msgTimer);for(var b=$("body"),c=0,d=a.length;d>c;c++){var e=$("#"+a[c].id+"Tips");if(!e[0]){e=$('<div class="validateTips validateError" id="'+a[c].id+'Tips"><div class="triangle_icon"><div class="before"></div><div class="after"></div></div>'+a[c].msg+"</div>");var f=a[c].el.offset(),g=parseInt(a[c].el.height()),h=parseInt(a[c].el.width()),i=f.left,j=f.top;"bottom"==this.msgPosition?(e.addClass("posBottom"),j+=g+4):"right"==this.msgPosition?(e.addClass("posRight"),i+=h+6):"top"==this.msgPosition&&(e.addClass("posTop"),j+=-1*g-8),e.css({left:i,top:j}),b.append(e)}}this.msgTimer=setTimeout(function(){$(".validateTips").remove()},3e3)},validateAll:function(a,b,c){for(var d in this.validatorArr){var e=this.validatorArr[d];e.validate()}var f=this.getValidatorState();f===!0?"function"==typeof a&&a.call(c):(this.isShowMsg&&this.showMsg(f),"function"==typeof b&&b.call(c,f))},removeValidator:function(a){a&&this.validatorArr[a]&&(this.validatorArr[a],this.validatorArr[a].check=!1)},addValidator:function(a){"string"==typeof a&&(a=$("#"+a)),this.initItem(a,"add")},getValidatorState:function(){var a=!0,b=[];for(var c in this.validatorArr)0==this.validatorArr[c].result.isPass&&(a=!1,b.push(this.validatorArr[c].result));return a?!0:b}});WidgetFactory.register({name:WIDGET_NAME,fn:InputValidator})}});