# c.lazyload

该对象提供了图片延迟加载的方法

        L.lazyload = function (img)

传入一个img的dom结构，或者一个包装过的dom结构，这个图片就会自动延迟加载

demo1:

        var el = self.$el.find('.carimg img');
        lazyload.lazyload(el);

demo2:

        var el = this.$el.find('#img');
        var src = prompt("请输入src")
        el.attr('src', src);
        lazyload.lazyload(el);
