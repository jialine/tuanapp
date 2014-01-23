define(['cBasePageView', TuanApp.getViewsPath('detail')], function(PageView, view){
    var Page = PageView.extend({
        render: function(){
            this.$el.html(view);
        },
        _addHeaderView: function(){
            this.injectHeaderView();
            this.headerview.set({
                title: '如家莫泰99元',
                back: true,
                home: true,
                view: this,
                tel: true,
                events: {
                    homeHandler: function (){
                        this.back('index');
                    },
                    returnHandler: function(){
                        this.back();
                    }
                }
            });
            this.headerview.show();
        },
        onCreate: function(){
            this.render();
        },
        onLoad: function(){
            this._addHeaderView();
            this.turning();
            setTimeout(function (){
                TuanApp.hideLoading();
            }, 5000);
        }
    });
    return Page;
});