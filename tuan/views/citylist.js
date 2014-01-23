define(['cBasePageView','cUICitylist', TuanApp.getViewsPath('citylist')], function (pageview, CityList, view) {
    var View = pageview.extend({
        render: function(){

        },
        onCreate: function(){
            this.citylist = new CityList({
                element: []
            });
            this.citylist.setData([]);
            //this.citylist.show();
        },
        onLoad: function(){
            this.turning();
        }
    });
    return View;
});