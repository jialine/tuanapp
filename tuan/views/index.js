define(['libs', 'c', 'cBasePageView', TuanApp.getViewsPath('index')], function(libs, c, pageview, html){
    "use strict";
    var View = pageview.extend({
        render: function(){
            this.$el.html(html);
        },

        onCreate: function () {
            this.injectHeaderView();

            this.render();
            var list = this.$el.find('#list');
            var listArr = [
                'alert',
                'headWarning',
                'inputClear',
                'loading',
                'mask',
                'scrollRadio',
                'scrollRadioList',
                'toast',
                'warning404'
            ];

            for(var i = 0, len = listArr.length; i < len; i++) {
                list.append($('<li><a href="index.html#' + listArr[i] + '">c.ui.' + listArr[i] + '</a></li>'))
            }
        },
        _addHeaderView: function(){
            this.injectHeaderView();
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