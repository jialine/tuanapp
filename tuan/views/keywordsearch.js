define(['libs', 'c', 'TuanModel', 'cDataSource', 'TuanStore',  TuanApp.getViewsPath('keywordsearch')], function (libs, c, TuanModel, cDataSource, TuanStore, html) {
    var cui = c.ui;
    var cuiTools = cui.Tools;
    var tuanSearchStore = TuanStore.GroupSearchStore.getInstance(), cBase = c.base,
     pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
     positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
     brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
     timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(); //日期筛选条件
	 historyKeySearchtore=TuanStore.TuanHistoryKeySearchStore.getInstance(),//历史关键词搜索列表
	 keyWordListStore=TuanStore.TuanKeyWordListStore.getInstance();//团购关键词列表数据
    var View = c.view.extend({
        tpl: html,
        tuankeyWordList: TuanModel.TuanKeyWordListModel.getInstance(),
        dateSource: new cDataSource(),
        selectItem: null,
        render: function () {
            this.viewdata.req = this.request;
            this.$el.html(this.tpl);
            this.els = {
                eltuancitylisttpl: this.$el.find('#city_tpl'),
                eltuancitylistbox: this.$el.find('#city_box'),
                eltuancitykeyword: this.$el.find('.place_search_box>.place_search')
            };
            this.cityListTplfun = _.template(this.els.eltuancitylisttpl.html());
        },
        events: {
			'input .place_search': 'tuanKeyWordInput',
            'click .city-item': 'keyItemonClick',
            'click .history_close': 'hcloseInput',
            'click .keyword_clear': 'onClearHistory'
        },
		hcloseInput:function(e){
			this.back('list');
        },
        onClearHistory: function (e) {
            historyKeySearchtore.remove();
            this.createPage({});
            this.els.eltuancitykeyword.val('');
            this.turning();
        },
        keyItemonClick: function (e) {
            
			var searchData = tuanSearchStore.get();
			var ctyId=searchData.ctyId;
			var ctyName=searchData.ctyName;
			tuanSearchStore.remove();
            var cur = $(e.currentTarget), id = cur.attr('data-id'), name = cur.attr('data-name');            

			tuanSearchStore.setAttr('keyId', id);
			tuanSearchStore.setAttr('keyName', name);
			//历史搜索 处理start----------
			this.addHistoryKey(id,name);
			//历史搜索 处理end-------------				
			
			tuanSearchStore.setAttr('ctyId', ctyId);
			tuanSearchStore.setAttr('ctyName', ctyName);
			
            //关键词搜索切选择后，历史查询记录应置为默认值
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
                _this.forward("list");
            }, 100);
        },		
        tuanKeyWordInput: function (e) {
            var cur = $(e.currentTarget), keyword = cur.val();
			cur.attr("waitsend",new Date().getTime());
			var inputwait=cur.attr("inputwait")||300;
            if (keyword) {
                keyword = keyword.replace(/\.|\{|\}|\[|\]|\*|\^/img, '');
                keyword = keyword.toLowerCase().trim();
				this.els.eltuancitylistbox.find('.historykeysearch').hide();
				this.els.eltuancitylistbox.find('keyword_clear').hide();
                this.els.eltuancitylistbox.find('li[data-filter]').hide();
				setTimeout(_.bind(function(target,inputwait){
					if(target){
						var waitsend=target.attr("waitsend");
						if(waitsend  && (new Date().getTime()-parseInt(waitsend))>parseInt(inputwait)){
							this.showLoading();
							this.getKeywordListData(target.val(),function () {
								this.turning();
								this.hideLoading();
							});
						}
					}
					
				},this,cur,inputwait),inputwait);
            } else {
				this.els.eltuancitylistbox.find('.historykeysearch').show();
				this.els.eltuancitylistbox.find('.keyword_clear').show();
                this.els.eltuancitylistbox.find('.city_list.searchresult>li[data-filter]').hide();
				this.els.eltuancitylistbox.find('.city_noresult').hide();
            }
        },
        buildEvent: function () {
            cui.InputClear(this.els.eltuancitykeyword);
        },
        getKeywordListData: function (keyword,callback) {
			this.tuankeyWordList.setParam('keyword', keyword);
            this.tuankeyWordList.excute(function (data) {
                this.createPage(data);
                callback.call(this);
            }, function (e) {
                callback.call(this);
            }, false, this);

        },
        createPage: function (data) {
            var searchData = tuanSearchStore.get();
            var keyId = searchData.keyId;
			var keyName = searchData.keyName;
			var hcitylist=this.getHistoryKey();
			if(hcitylist.length>0){
				if(!data.history)data.history=[];
				data.history=data.history.apply.concat(data.history,hcitylist);
			}
            var html = this.cityListTplfun({ data: data, keyid: keyId});
            this.els.eltuancitylistbox.html(html);
            
			this.els.eltuancitylistbox.find('.city_noresult').hide();
        },
		addHistoryKey:function(Id,Name){
			var historyCityData=historyKeySearchtore.get();
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
				if(list.length>3)list.pop();
			}
			historyCityListStore.remove();
			historyCityListStore.setAttr("list",list);
		},
		getHistoryKey:function(){
			var historyCityData=historyKeySearchtore.get();
			var hcitylist=[];
			if(historyCityData && historyCityData.list){
				hcitylist=historyCityData.list;
			}
			return hcitylist;
		},
        //首次记载view，创建view
        onCreate: function () {
            this.render();
            this.buildEvent();
        },
        //加载数据时
        onLoad: function () {
            this.cityType = ({ depart: 1, back: 2 })[this.getPath(0)];
			this.createPage({});			
			this.els.eltuancitykeyword.val('');	
			if(this.headerview)this.headerview.hide();
			this.turning();
			this.hideLoading();
        },
        //调用turning方法时触发
        onShow: function () {
        },
        onHide: function () { }
    });
    return View;
});
