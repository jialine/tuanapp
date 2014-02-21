define(['cStore', 'cBase', 'cUtility'], function (AbstractStore, cBase, cUtility) {
    var T = {};
    //当前团购详情（zhang_f）
    T.TuanDetailsStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_DETAILS';
            this.lifeTime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //房态信息
    T.TuanStatusStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_STATUS';
            this.lifeTime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店分店信息
    T.TuanHotelListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_HOTEL_LIST';
            this.lifeTime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店评论信息
    T.TuanHotelCommentListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_HOTEL_COMMENT';
            this.lifeTime = '1D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    /**
    * 发票相关(l_wang)
    */
    T.TuanInvoiceStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'GROUP_INVOICE';
            this.lifetime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //我的团购订单列表(l_wang)
    T.TuanOrderListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_ORDER_LIST';
            this.lifeTime = '3M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //预定订单页的订单信息(l_wang)
    T.TuanOrderInfoStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_ORDER_INFO';
            this.lifeTime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //酒店团购列表页Storage （caof 2013-08-06）
    T.GroupListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_LIST'; //Storage名称
            this.lifeTime = '30M'; //缓存30分钟
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购搜索Storage （caof 2013-08-07）
    T.GroupSearchStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_SEARCH'; //Storage名称
            this.lifeTime = '1D'; //缓存1天
            this.defaultData = {
                pageIdx: '1',//页码
                ctyId: '', //城市编号
                bdate: cBase.Date.format(cUtility.getServerDate(), 'Y-m-d H:i:s'), //时间
                edate: cBase.Date.format(cUtility.getServerDate(), 'Y-m-d H:i:s'), 
                flag:0,
                productType: '1', //马上团标识
                qparams: [], //查询参数列表
                sortRule:'2',//排序规则 2标识默认排序
                sortType: '0', //排序方式 1标识降序
                sotrName:'',
                dataVer: 99,
	            ver: 99,
	            tuanType: 0 //团购类型，默认全部
            };
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //酒店团购价格星级筛选Storage （caof 2013-08-07）
    T.GroupPriceStarFilterStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_PRICESTARFILTER'; //Storage名称
            this.lifeTime = '1D'; //缓存1天
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购位置筛选Storage （caof 2013-08-07）
    T.GroupPositionFilterStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_POSITIONFILTER'; //Storage名称
            this.lifeTime = '1D'; //缓存1天
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //酒店团购团购过滤条件获取(位操作) 1:品牌集团; 2:行政区; 4:商业区; 若为0则不返回数据Storage （caof 2013-08-07）
    T.GroupConditionStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_CONDITIONFILTER'; //Storage名称
            this.lifeTime = '3D'; //缓存3天
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购品牌筛选Storage （caof 2013-08-07）
    T.GroupBrandFilterStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_BRANDFILTER'; //Storage名称
            this.lifeTime = '1D'; //缓存1天
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购入住时间筛选Storage （caof 2013-08-07）
    T.GroupCheckInFilterStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.lifeTime = '1D'; //缓存1天
            this.key = 'TUAN_CHECKINFILTER'; //Storage名称
            this.defaultData = {
                type: 12,
                val:'',
                beginDate: '', 
                endDate: '' 
            };
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //我的团购订单详情(l_wang)
    T.TuanOrderDetailStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_ORDER_DETAIL';
            this.lifeTime = '30M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //用户订单参数Storage add by caof 2013-08-24
    T.GroupOrderParamStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'USER_GROUP_ORDERPARAM';
            this.lifeTime = '15M'; //缓存15分钟，离开团购订单详情页时清除
            this.isUserData = true;
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //用户从订单详情返回时，判断跳转至哪页 （add by caof）
    T.OrderDetailReturnPage = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'GROUP_RETURNPAGE';
            this.lifeTime = '15M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //团购城市列表数据
    T.TuanCityListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_CITY_LIST';
            this.lifeTime = '15D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
	//团购历史选择城市列表数据 （add by zhanghd 2014-02-17）
	T.TuanHistoryCityListStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_HISTORYCITY_LIST';
			this.lifeTime = '15D';
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});

	//酒店团购团购类型Storage (xuweichen 2014-2-14)
	T.GroupCategoryFilterStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_CATEGORYFILTER'; //Storage名称
			this.lifeTime = '1D'; //缓存1天
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});
	//酒店团购排序Storage (xuweichen 2014-2-14)
	T.GroupSortStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_SORTFILTER'; //Storage名称
			this.lifeTime = '1D'; //缓存1天
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});
	//酒店团购排序Storage (xuweichen 2014-2-14)
	T.GroupDistanceStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_DISTANCEFILTER'; //Storage名称
			this.lifeTime = '1D'; //缓存1天
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});
	//酒店团购餐饮类型筛选Storage (xuweichen 2014-2-18)
	T.GroupTypeFilterStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_TYPEFILTER'; //Storage名称
			this.lifeTime = '1D'; //缓存1天
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});
	//酒店度假天数筛选Storage (xuweichen 2014-2-18)
	T.GroupDayFilterStore = new cBase.Class(AbstractStore, {
		__propertys__: function () {
			this.key = 'TUAN_DAYFILTER'; //Storage名称
			this.lifeTime = '1D'; //缓存1天
		},
		initialize: function ($super, options) {
			$super(options);
		}
	});
		//团购历史关键词搜索列表数据 （add by zhanghd 2014-02-17）
    T.TuanHistoryKeySearchStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_HISTORYKEYSEARCH_LIST';
            this.lifeTime = '15D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
	//团购关键词列表数据（add by zhanghd 2014-02-19）
    T.TuanKeyWordListStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_KEYWORD_LIST';
            this.lifeTime = '15D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
	T.GroupGeolocation = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'TUAN_GEOLOCATION'; //Storage名称
            this.lifeTime = '1D'; //缓存1天
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    return T;
})
