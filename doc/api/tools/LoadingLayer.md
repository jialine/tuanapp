[组件名称]
===========
LoadingLayer

# [功能]
弹出无遮罩层的提示loading框，用户可传入一个回调函数以及需要显示的文字（回调函数在关闭时候执行）

# [使用方法]
        //在弹出层关闭前会执行回调函数
        var l = new c.ui.LoadingLayer(function () {
            alert('');
            var s = '';
        });
        l.show();

