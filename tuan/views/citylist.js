define(['libs', 'cBasePageView','cUICitylist', 'cDataCityList', TuanApp.getViewsPath('citylist')], function (libs, pageview, CityList, CityListData, view) {
	var View = pageview.extend({
        render: function(){
//	        this.$el.html(_.template(view)(CityListData));
//	        console.log();
        },
	    addHeaderView: function () {
		    var self = this;
		    this.headerview.set({
			    //container: self.$el,
			    // data: {
			    title: '携程团购酒店-选择城市',
			    back: true,
			    home: true,
			    view: this,
			    tel: true,
			    events: {
				    homeHandler: function () {
					    this.back('index');
				    },
				    returnHandler: function () {
					    this.back();
					    //alert('已经是首页了');
				    }
			    }
			    //}
		    });
		    this.headerview.show();
	    },
		groupCityData: function(data){
			var group,
				groupLetter,
				grouped = {};

			data.forEach(function (item){
				groupLetter = item.FirstLetter;
				group = grouped[groupLetter] || [];

				if(!group.length){
					grouped[groupLetter] = group;
				};
				group.push(item);
			});
//			console.log(grouped);
			return grouped
		},
        onCreate: function(){
	        var self = this;
	        this.render();
//	        console.log(self.groupCityData(CityListData.data));
            this.citylist = new CityList({
                element: this.$el,
	            'data' : {
		            'inland':[
			            {name:'上海',id:'2'}
		            ],
		            'aboard':[
			            {name:'剑桥',id:'12322'}
		            ]
	            },
	            'autoLocCity': '上海',
	            'defaultDataName': 'inland',
	            'itemClickFun': function (data) {
		            self.citySelectAction(data);
	            }
//	            data: {inland: self.groupCityData(CityListData.data)}
            });
//            this.citylist.setData(CityListData);
	        this.injectHeaderView();
            //this.citylist.show();
        },
        onLoad: function(){
	        this.addHeaderView();
            this.turning();
        }
    });
    return View;
});