c.business.view
===========
继承自c.ui.view

为ui.View增加业务逻辑。
使用方法与UI.View类似

    var View = c.business.view.extend({
        pageid: '212003',

        events: {
            'click #js_return': 'backAction'
        },

        //首次记载view，创建view
        onCreate: function () {

        },
        //加载数据时
        onLoad: function (lastViewName) {
            //updatePage为自定义的请求数据的方法,参数为成功时的回调
            this.updatePage(function () {
                this.turning();
            })
        },
        //调用turning方法后触发
        onShow: function () {
            this.setTitle('机票搜索页');
        },
        //
        onHide: function () {
            this.resizehandler && $(window).unbind('resize', this.resizehandler);
        }
    });


## Method

### onShowFinish

onShowfinish()

onShow事件中处理业务的方法。
