define(["libs","cBase","cUIAbstractView","cUIMask","cUIHashObserve"],function(a,b,c,d,e){var f={},g={prefix:"cui-"};return f.__propertys__=function(){this.mask=new d({classNames:[g.prefix+"warning-mask"]}),this.hashObserve=new e({hash:this.id,scope:this,callback:function(){this.hide()}})},f.initialize=function(a,b){this.addClass(g.prefix+"pageview"),this.addEvent("onCreate",function(){this.mask.create(),this.mask.root.css({background:"url(data:image/gif;base64,R0lGODlhAQABAIAAAPX19QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==) repeat"}),this.root.css({position:"absolute",left:"0px",top:"0px"})}),this.addEvent("onShow",function(){this.mask.show(),this.mask.root.css({"z-index":"500"}),this.hashObserve.start(),this.root.bind("touchmove",function(a){a.preventDefault()})}),this.addEvent("onHide",function(){this.mask.hide(),setTimeout($.proxy(function(){this.hashObserve.end()},this),10)}),a(b)},f.createHtml=function(){return""},new b.Class(c,f)});