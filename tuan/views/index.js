define(['libs', 'c', 'cBasePageView', TuanApp.getViewsPath('index')], function(libs, c, pageview, html){
    "use strict";
    var View = pageview.extend({
        render: function(){
            this.$el.html(html);
        },

        onCreate: function () {
            this.render();
            this.injectHeaderView();
        },
        _addHeaderView: function(){
            this.headerview.set({

                    title: '携程团购酒店',
                    back: true,
                    home: true,
                    view: this,
                    tel: true,
                    events: {
                        homeHandler: function (){
                            this.back('index');
                        },
                        returnHandler: function(){
                            //this.back();
                            alert('已经是首页了');
                        }
                    }

            });
            //this.headerview.set();
            this.headerview.show();
        },
        events: {
        },

        onLoad: function(){
            this._addHeaderView();
            this.turning();
        },

        onShow: function(){

        },

        onHide: function(){

        }

    });

    return View;

});