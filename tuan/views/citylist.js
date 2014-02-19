define(['libs', 'c', 'TuanModel', 'cDataSource', 'TuanStore',  TuanApp.getViewsPath('citylist')], function (libs, c, TuanModel, cDataSource, TuanStore, html) {
    var cui = c.ui;
    var cuiTools = cui.Tools;
    var tuanSearchStore = TuanStore.GroupSearchStore.getInstance(), cBase = c.base,
     pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
     positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
     brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
     timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(); //日期筛选条件
	 historyCityListStore=TuanStore.TuanHistoryCityListStore.getInstance();//历史选择城市
    var View = c.view.extend({
        pageid: '214002',
        tpl: html,
        tuanCityList: TuanModel.TuanCityListModel.getInstance(),
        dateSource: new cDataSource(),
        selectItem: null,
        render: function () {
            this.viewdata.req = this.request;
            this.$el.html(this.tpl);
            this.els = {
                eltuancitylisttpl: this.$el.find('#city_tpl'),
                eltuancitylistbox: this.$el.find('#city_box'),
                eltuancitykeyword: this.$el.find('#city_keyword')
            };
            this.cityListTplfun = _.template(this.els.eltuancitylisttpl.html());
        },
        events: {
            'click #js_return': 'backAction',
            'click .city-group-title': 'cityGroupTitleClick',
            'input #city_keyword': 'tuanCityKeyWordInput',
            'click .city-item': 'CityItemonClick'
        },
        backAction: function () {
            this.back('list');
        },
        CityItemonClick: function (e) {
            
			var searchData = tuanSearchStore.get();
			tuanSearchStore.remove();
            var cur = $(e.currentTarget), id = cur.attr('data-id'), name = cur.attr('data-name');            
			if(id=="nearby"){
				tuanSearchStore.setAttr('nearby', true);
				tuanSearchStore.setAttr('ctyId', 99999999);
			}else{				
				tuanSearchStore.setAttr('nearby', false);	
				tuanSearchStore.setAttr('ctyId', id);
				//历史选择 处理start----------
				this.addHistoryCity(id,name);
				//历史选择 处理end-------------
			}			
			tuanSearchStore.setAttr('ctyName', name);
			tuanSearchStore.setAttr('cCtyId', searchData.cCtyId);
			tuanSearchStore.setAttr('cCtyName', searchData.cCtyName);
            //城市切换后，历史查询记录应置为默认值
            var searchData = tuanSearchStore.get();
            var d = cBase.Date.format(this.getServerDate(), 'Y-m-d H:i:s');
            var qparams = [];
            tuanSearchStore.setAttr('qparams', qparams);
            tuanSearchStore.setAttr('pageIdx', 1);
            tuanSearchStore.setAttr('sortRule', 2);
            tuanSearchStore.setAttr('sortType', 0);
            tuanSearchStore.setAttr('bdate', d);
            tuanSearchStore.setAttr('edate', d);
            tuanSearchStore.setAttr('sotrName', '');
            pricefilterStore.remove();
            positionfilterStore.remove();
            brandfilterStore.remove();
            timefilterStore.remove();
            //返回列表页
            var _this = this;
            setTimeout(function () {
                _this.back("list");
            }, 100);
        },
        cityGroupTitleClick: function (e) {
            var cur = $(e.currentTarget);
			cur.parent().siblings('.main-item:not(.currentcity):not(.nearby)').find('.sub-city-box').hide();
            cur.next('ul').toggle(200);
        },
        tuanCityKeyWordInput: function (e) {
            var cur = $(e.currentTarget), keyword = cur.val();
            if (keyword) {
                keyword = keyword.replace(/\.|\{|\}|\[|\]|\*|\^/img, '');
                keyword = keyword.toLowerCase().trim();
                this.els.eltuancitylistbox.find('.main-item').show();
                var subcitybox = this.els.eltuancitylistbox.find('.sub-city-box');
                subcitybox.show();
                this.els.eltuancitylistbox.find('.city-group-title').hide();
                this.els.eltuancitylistbox.find('li[data-filter]').hide();
                var domlist = this.els.eltuancitylistbox.find('li[data-filter*=' + keyword + ']');
                domlist.show();
                subcitybox.each(function (n, v) {
                    var ul = $(v);
                });
                var emptymainitem = this.els.eltuancitylistbox.find('.empty-main-item');
                this.els.eltuancitylistbox.find('.hotcitys').hide();
				this.els.eltuancitylistbox.find('.historycitys').hide();
            } else {
                this.els.eltuancitylistbox.find('.main-item').show();
                this.els.eltuancitylistbox.find('.main-item:not(.nearby):not(.currentcity)>.sub-city-box').hide();
                this.els.eltuancitylistbox.find('.city-group-title').show();
                this.els.eltuancitylistbox.find('li[data-filter]').show();
				this.els.eltuancitylistbox.find('.hotcitys .sub-city-box').show();
				this.els.eltuancitylistbox.find('.historycitys .sub-city-box').show();
            }
        },
        buildEvent: function () {
            cui.InputClear(this.els.eltuancitykeyword);
        },
        updatePage: function (callback) {
            this.tuanCityList.excute(function (data) {
                this.createPage(data);
                callback.call(this);
            }, function (e) {
                callback.call(this);
            }, false, this);

        },
        createPage: function (data) {
            var searchData = tuanSearchStore.get();
            var ctyId = searchData.ctyId;
			var ctyName = searchData.ctyName;
			var currentCityName=ctyName;
			var currentCityId=ctyId;
			var nearby = searchData.nearby!=false?true:false;
			if(!searchData.cCtyId){//首次设置 当前城市值 即定位到城市
				tuanSearchStore.setAttr('cCtyId', ctyId);
				tuanSearchStore.setAttr('cCtyName', ctyName);
			}else{
				//if(nearby){//我附近的团购 被选择时，当前城市 为 定位到城市
					currentCityId = searchData.cCtyId;
					currentCityName = searchData.cCtyName;
				//}
			}
			if(nearby)ctyId=0;
			var hcitylist=this.findHistoryCity(data.cities);
			if(hcitylist.length>0){
				data.cities.push({tag:'history',cities:hcitylist});
			}
            var html = this.cityListTplfun({ data: data.cities, cityid: ctyId, currentcityid:currentCityId, currentcityname:currentCityName, nearby:nearby });
            this.els.eltuancitylistbox.html(html);
            this.els.eltuancitykeyword.val('');
            this.selectItem = this.els.eltuancitylistbox.find('.citylistcrt');
        },
		addHistoryCity:function(Id,Name){
			var historyCityData=historyCityListStore.get();
			var list=[];
			if(historyCityData && historyCityData.list&&$.isArray(historyCityData.list))list=historyCityData.list;
			var obj,idx=0;
			$.each(list,function(i,d){	
				if(d.id!=Id){
					return true;
				}else{
					obj=d;
					idx=i;
					return false;
				}
			})
			if(obj && obj.id==Id){
				list.splice(idx,1);
				list.unshift({id:Id,name:Name});				
			}else{
				list.unshift({id:Id,name:Name});
				if(list.length>10)list.pop();
			}
			historyCityListStore.remove();
			historyCityListStore.setAttr("list",list);
		},
		findHistoryCity:function(data){
			var historyCityData=historyCityListStore.get();
			var hcitylist=[];
			if(historyCityData && historyCityData.list){
				var ni=historyCityData.list.length>3?3:historyCityData.list.length;				
				for(var st=0;st<ni;st++){
					var f=false,hcity=historyCityData.list[st];
					for(var i=0,olen=data.length,Item;i<olen;i++){ 
						Item=data[i];
						if(Item.tag=='热门' && Item.cities){
							for(var j in Item.cities){
								var c=Item.cities[j];
								if(c.id==hcity.id){
									f=true;
									hcitylist.push(new Object(c));
									break;
								}
							}
							if(f)break;
						}
					}					
					if(!f){
						for(var i=0,olen=data.length,Item;i<olen;i++){ 
							Item=data[i];
							if(Item.tag!='热门' && Item.cities){
								for(var j in Item.cities){
									var c=Item.cities[j];
									if(c.id==hcity.id){
										f=true;
										hcitylist.push(new Object(c));
										break;
									}
								}
								if(f)break;
							}
						}
					}
				}
			}
			return hcitylist;
		},
        ShowAfter: function () {
            //显示
            var inlistbox = this.selectItem.parent();
            var titlebtu = inlistbox.prev('.city-group-title');
            var parent = inlistbox.parent();
            if (parent.length) {
                if (this.selectItem.length > 1) {
                    window.scrollTo(0, 0);
                } else {
                    titlebtu.trigger('click');
                    var t = cuiTools.getElementPos(parent[0]);
                    window.scrollTo(0, t.top - 60);
                }
            }
        },
        //首次记载view，创建view
        onCreate: function () {
            this.render();
            this.buildEvent();
        },
        //加载数据时
        onLoad: function () {
            this.cityType = ({ depart: 1, back: 2 })[this.getPath(0)];
            this.updatePage(function () {
                this.turning();
                this.hideLoading();
            });
        },
        //调用turning方法时触发
        onShow: function () {
            this.ShowAfter();
            this.setTitle('城市列表');
        },
        onHide: function () { }
    });
    return View;
});
