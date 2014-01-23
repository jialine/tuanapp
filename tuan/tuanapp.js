require(['libs', 'App', 'cUI'], function(libs, App, cUI){
    var TuanApp = {
        getViewsPath: function(htmlpath){
            return 'text!tuan/views/' + htmlpath + '.html';
        },
        init: function(){
            new App({
                'defaultView': 'tuan/views/index',
                'viewRootPath': 'tuan/views/'
            });
            this.loading = new cUI.Loading();
        },
        showLoading: function(){
            this.loading.show();
        },
        hideLoading: function(){
            this.loading.hide();
        }
    };

    TuanApp.init();
    window.TuanApp = TuanApp;
});
