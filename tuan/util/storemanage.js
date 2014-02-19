/**
 * @author: xuweichen
 * @date: 14-2-18 下午2:07
 * @descriptions
 */
define(['TuanStore'], function (TuanStore) {
	var searchStore = TuanStore.GroupSearchStore.getInstance(),
		pricefilterStore = TuanStore.GroupPriceStarFilterStore.getInstance(), //价格星级筛选条件
		positionfilterStore = TuanStore.GroupPositionFilterStore.getInstance(), //区域筛选条件
		brandfilterStore = TuanStore.GroupBrandFilterStore.getInstance(), //品牌筛选条件
		timefilterStore = TuanStore.GroupCheckInFilterStore.getInstance(), //日期筛选条件
		distancefilterStore = TuanStore.GroupDistanceStore.getInstance(),
		typefilterStore = TuanStore.GroupTypeFilterStore.getInstance(), //餐饮娱乐类型
		categoryfilterStore = TuanStore.GroupCategoryFilterStore.getInstance(),
		sortStore = TuanStore.GroupSortStore.getInstance(); //团购排序

	var Manage = {
		clearSpecified: function(){
			searchStore.setAttr('qparams', []);
			searchStore.setAttr('sortRule', 2);
			searchStore.setAttr('sortType', 0);
			searchStore.setAttr('sortName', '');
			searchStore.setAttr('withoutReservation', 0);
			searchStore.setAttr('holidayAvailable', 0);
			searchStore.setAttr('multiShop', 0);
			searchStore.setAttr('hourRateRoom', 0);
			pricefilterStore.remove();
			typefilterStore.remove();
			positionfilterStore.remove();
			brandfilterStore.remove();
			timefilterStore.remove();
			distancefilterStore.remove();
			sortStore.remove();
		},
		clearAll: function(){
			this.clearSpecified();
			categoryfilterStore.remove();
		}
	};
	return Manage;
});