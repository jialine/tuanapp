define(["libs","cBase"],function(){var a=function(){var a="placeholder"in document.createElement("input"),b=function(b,c,d,e){c||(c=""),e=e||{};var f="string"==typeof b?$(b):b;f.each(function(){var b=$('<a class="clear-input '+c+'" href="javascript:;"><span></span></a>'),f=$(this);if(e.left&&b.css({left:e.left+"px",right:"auto"}),e.top&&b.css({top:e.top+"px",bottom:"auto"}),e.right&&b.css({right:e.right+"px",left:"auto"}),e.bottom&&b.css({bottom:e.bottom+"px",top:"auto"}),f.parent().addClass("clear-input-box"),!a)var g=f.attr("placeholder"),h=$('<span class="placeholder-title'+(c?" placeholder-"+c:"")+'">'+g+"</span>");b.hide(),f.bind({focus:function(){var a=$.trim(f.val());""!=a&&b.show()},input:function(){window.setTimeout(function(){var c=f.val();""==c?b.hide():b.show(),a||(""==c?h.show():h.hide())},10)},blur:function(){var c=$.trim(f.val());a||(""==c?h.show():h.hide()),setTimeout(function(){b.hide()},200)}}),b.bind("click",function(){f.val(""),f.keyup(),b.hide(),f.focus(),f.trigger("input"),"function"==typeof d&&d.call(this)}),f.after(b),a||(f.after(h),h.bind("click",function(){f.focus()})),f.blur()})};return b}();return a});