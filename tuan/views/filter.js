define(['cBasePageView', 'cStorage', TuanApp.getViewsPath('filter')], function(pageview, Storage, view){
	var View = pageview.extend({
		render: function(){
			this.$el.html(view);
		},

		onCreate: function () {
			this.render();
			this.injectHeaderView();
		},
		_addHeaderView: function(){
			this.headerview.set({
				title: '酒店筛选',
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
//						alert('已经是首页了');
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

		},
		getFilters: function(){

		},
		createStorage: function(){
			Storage
		}
	});
	return View;
});
