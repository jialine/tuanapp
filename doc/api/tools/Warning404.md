[组件名称]
===========
Warning404

# [功能]
弹出404提示框

# [使用方法]
        //绑定的回调函数为点击重试时候触发的事件
        this.showWarning404(function () {});

## [demo]
        //ajax请求失败时候弹出404提醒，
        c.ajax.get(url, {}, $.proxy(function (data) {
            alert('请求成功');
        }, this), $.proxy(function () {
            this.showWarning404(function () {
                location.reload();
            });
            var s = '';
        }, this))
