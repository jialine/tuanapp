define(['c', 'cBasePageView', 'TuanStore', 'TuanModel', 'Switch', TuanApp.getViewsPath('filter')], function (c, BasePage, TuanStore, TuanModels, Switch, html) {
	var searchStore = TuanStore.GroupSearchStore.getInstance(), //搜索条件
		conditionModel = TuanModels.TuanConditionModel.getInstance(), //团购筛选Model
		pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
		positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
		brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
		timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(), //日期筛选条件
		categoryfilterStore = TuanStore.GroupCategoryFilterStore.getInstance();  //团购类型

	var View = BasePage.extend({
		pageid:'214003',
		tpl:html,
		render:function () {
			this.$el.html(this.tpl);
			this.elsBox = {
				filter_tpl:this.$el.find('#filterTpl'), //筛选模板
				filter_box:this.$el.find('#filterBox')//筛选容器
			};
			this.filter_fun = _.template(this.elsBox.filter_tpl.html());
		},
		events:{
			'click .jsDefault':'defaultAction', //设置默认
			'click #js_return':'returnAction', //返回列表页
			'click li[data-id]':'viewAction', //查看筛选条件
			'click .jsBtn':'filterAction'//确认查询条件
		},
		onCreate:function () {
			this.render();
		},
		onShow:function () {
			this.setTitle('团购筛选');
		},
		initWithoutReservation:function () {
			new Switch({
				wrap:$('#J_free'),
				cursorCls:'i',
				onChange:function (rs) {
					this.cursor.html(rs ? '开' : '关');
				}
			});
			return this;
		},
		initHolidayAvailable:function () {
			new Switch({
				wrap:$('#J_free2'),
				cursorCls:'i',
				onChange:function (rs) {
					this.cursor.html(rs ? '开' : '关');
				}
			});
			return this;
		},
		onLoad:function () {
			var searchData = searchStore.get();
			conditionModel.setParam('ctyId', searchData.ctyId);
			var type = 1; //品牌
			type |= 2; // 行政区
			type |= 4; //商业区
			conditionModel.setParam('type', type);
			//绑定上一次筛选条件
			this.showFilter();
			this.turning();
			this.getFilterData();
			this.initWithoutReservation().initHolidayAvailable();
		},
		onHide:function () {
		},
		showFilter:function () {
			var filterData = {}, searchInfo = searchStore.get();
			var priceFilterData = pricefilterStore.get();
			var positionFilterData = positionfilterStore.get();
			var brandFilterData = brandfilterStore.get();
			var timeFilterData = timefilterStore.get();
			var qparams = searchInfo && searchInfo.qparams ? searchInfo.qparams : null;
			if (qparams && qparams.length > 0) {
				for (var i = 0, l = qparams.length; i < l; i++) {
					var q = qparams[i];
					if (+q.type == 1 || +q.type == 2) {
						if (!priceFilterData || !priceFilterData.type) {
							priceFilterData = q;
							priceFilterData.val = q.value;
						}
					}
					if (+q.type == 4 || +q.type == 5) {
						if (!positionFilterData) {
							positionFilterData = q;
							positionFilterData.val = q.value;
						}
					}
					if (+q.type == 3) {
						if (!brandFilterData || !brandFilterData.type) {
							brandFilterData = q;
							brandFilterData.val = q.value;
						}
					}
					if (+q.type == 12) {
						if (!timeFilterData || !timeFilterData.type || !timeFilterData.val || timeFilterData.val.length <= 0) {
							timeFilterData = q;
							var arr = q.value.split('|');
							timeFilterData.beginDate = arr[0];
							timeFilterData.endDate = arr[1];
							timeFilterData.val = q.value;
							timeFilterData.name = arr[0] + "至" + arr[1];
						}
					}
				}
			}
			;
			//团购类型
			filterData.Type = categoryfilterStore.getAttr('category');
			//星级价格
			filterData.PriceStar = priceFilterData;
			if (priceFilterData) {
				pricefilterStore.set(priceFilterData);
			}
			;
			//位置
			filterData.Position = positionFilterData;
			if (positionFilterData) {
				positionfilterStore.set(positionFilterData);
			}
			;
			//品牌
			filterData.Brand = brandFilterData;
			if (brandFilterData) {
				brandfilterStore.set(brandFilterData);
			}
			;
			//入住时间
			filterData.CheckIn = timeFilterData;
			if (timeFilterData && timeFilterData.val != '') {
				timefilterStore.set(timeFilterData);
			} else {
				timefilterStore.remove();
			}
			var item = this.filter_fun(filterData);
			this.elsBox.filter_box.html(item);
		},
		getFilterData:function () {
			this.showLoading();
			conditionModel.excute(function (data) {
				this.hideLoading();
			}, function (err) {
				this.hideLoading();
			}, false, this);
		},
		defaultAction:function () {
			//恢复默认条件
			pricefilterStore.remove();
			positionfilterStore.remove();
			brandfilterStore.remove();
			timefilterStore.remove();
			var qparams = [];
			searchStore.setAttr('qparams', qparams);
			searchStore.setAttr('pageIdx', '1');
			searchStore.setAttr('sortRule', '2');
			searchStore.setAttr('sortType', '0');
			searchStore.setAttr('sotrName', '');
			var _this = this;
			setTimeout(function () {
				_this.back("list");
			}, 100);
		},
		filterAction:function (e) {
			//设置查询条件
			var qparams = [];
			var priceStarFilterData = pricefilterStore.get();
			priceStarFilterData = priceStarFilterData ? priceStarFilterData : { type:'', val:'' };
			if (priceStarFilterData && priceStarFilterData.type && +priceStarFilterData.type > 0 && priceStarFilterData.val && priceStarFilterData.val != '') {
				qparams.push(
					{
						type:priceStarFilterData.type,
						value:priceStarFilterData.val,
						name:priceStarFilterData.name
					}
				);
			}
			var positionData = positionfilterStore.get();
			positionData = positionData ? positionData : { type:'', val:'' };
			if (positionData && positionData.type && +positionData.type > 0 && positionData.val && positionData.val != '') {
				qparams.push(
					{
						type:+positionData.type,
						typeId:+positionData.typeId,
						value:positionData.val,
						name:positionData.name
					}
				);
			}
			var brandData = brandfilterStore.get();
			brandData = brandData ? brandData : { type:'', val:'' };
			if (brandData && brandData.type && +brandData.type > 0 && brandData.val && brandData.val != '') {
				qparams.push(
					{
						type:brandData.type,
						value:brandData.val,
						name:brandData.name
					}
				);
			}
			var timeData = timefilterStore.get();
			timeData = timeData ? timeData : { type:'', val:'' };
			if (timeData && timeData.type && +timeData.type > 0 && timeData.val && timeData.val.length > 0) {
				qparams.push(
					{
						type:12,
						value:timeData.val,
						name:timeData.name
					}
				);
			} else {
				timefilterStore.remove();
			}
			var searchData = searchStore.get();
			if (searchData) {
				if (!searchData.edate) {
					searchStore.setAttr('edate', searchData.bdate);
				}
			}
			searchStore.setAttr('qparams', qparams);
			searchStore.setAttr('pageIdx', '1');
			//searchStore.setAttr('sortRule', '2');
			//searchStore.setAttr('sortType', '0');
			var _this = this;
			setTimeout(function () {
				_this.back("list");
			}, 100);
		},
		viewAction:function (e) {
			var target = $(e.currentTarget);
			var type = target.attr('data-id');
			if (type) {
				if (+type == 1) {
					this.forward('pricefilter');
				}
				if (+type == 2) {
					this.forward('positionfilter');
				}
				if (+type == 3) {
					this.forward('brandfilter');
				}
				if (+type == 4) {
					this.forward('timefilter');
				}
			}
		},
		returnAction:function (e) {
			pricefilterStore.remove();
			positionfilterStore.remove();
			brandfilterStore.remove();
			timefilterStore.remove();
			this.back('list');
		}
	});
	return View;
});
