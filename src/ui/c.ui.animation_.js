define([],function(){return{slideleft:function(a,b,c,d){return a.addClass("animatestart"),a.addClass("sliderightin"),a.__show(),setTimeout(function(){a.removeClass("animatestart"),a.removeClass("sliderightin"),b&&b.__hide(),c&&c.call(d,a,b)},340)},slideright:function(a,b,c,d){return b&&(b.addClass("animatestart"),b.addClass("sliderightout")),a.__show(),setTimeout(function(){b&&(b.removeClass("animatestart"),b.removeClass("sliderightout"),b.__hide()),c&&c.call(d,a,b)},340)},noAnimate:function(a,b,c,d){this.mainframe.hide(),b&&b.__hide(),a.__show(),this.mainframe.show(),c&&c.call(d,a,b)}}});