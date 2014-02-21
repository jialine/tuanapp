define(['cModel', 'cBase', 'TuanStore'], function (AbstractModel, cBase, TuanStore) {
    var T = {};
    //团购详情Model (zhang_f)
    T.TuanDetailModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/Product/Query';
            this.method = 'POST';
            this.param = { ext: "", flag: 0, id: 33483, ver: 0 };
//            this.param = { ext: "", flag: 0, id: 33246, ver: 0 };
            this.result = TuanStore.TuanDetailsStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //房态信息Model (zhang_f)
    T.TuanStatusModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/Room/Status/Query';
            this.method = 'POST';
            this.param = { bdate:"",edate:"",pid:0,ext: "", flag: 0, ver: 0 };
            //            this.param = { ext: "", flag: 0, id: 33246, ver: 0 };
            this.result = TuanStore.TuanStatusStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店分店信息Model (zhang_f)
    T.TuanHotelListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/HotelList/Query';
            this.method = 'POST';
            this.param = { ext: "",flag: 0,pid: 0,qparams: null,ver: 0};
            //            this.param = { ext: "", flag: 0, id: 33246, ver: 0 };
            this.result = TuanStore.TuanHotelListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店评论信息Model (zhang_f)
    T.TuanHotelCommentListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/CommentList/Query';
            this.method = 'POST';
            this.param = { ext: "", flag: 0, hotelId: 0, pageIdx: 1, ver: 0 };
            this.result = TuanStore.TuanHotelCommentListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //我的团购订单(l_wang)
    T.TuanOrderListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/OrderList/Query';
            this.method = 'POST';
            this.isUserData = true;
            this.param = {
                "ext": "",
                "flag": 0,
                "pageIdx": 1,
                "ver": 0
            };
            this.result = TuanStore.TuanOrderListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //我的团购订单详情(l_wang)
    T.TuanOrderDetailModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/Order/Query';
            this.method = 'POST';
            this.isUserData = true;
            this.param = {
                "ext": "",
                "flag": 0,
                "ver": 0
            };
            this.result = TuanStore.TuanOrderDetailStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //我的团购订单详情(l_wang)
    T.TuanSendMsgModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/Message/Send';
            this.method = 'POST';
            this.param = {
                "ext": "",
                "flag": 0,
                "ver": 0
            };
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //酒店团购列表Model（caofu 2013-08-06）
    T.TuanListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/ProductList/Query';
            this.method = 'POST';
            this.param = TuanStore.GroupSearchStore.getInstance();
            this.result = TuanStore.GroupListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购团购过滤条件(位操作) 1:品牌集团; 2:行政区; 4:商业区; 若为0则不返回数据Model（caofu 2013-08-08）
    T.TuanConditionModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/ConditionList/Query';
            this.method = 'POST';
            this.param = { dataVer: 99, ver: 99 };
            this.result = TuanStore.GroupConditionStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //酒店团购列表Model（caofu 2013-08-06）
    T.TuanCityListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/CityList/Query';
            this.method = 'POST';
            this.param = { dataVer: 99, ver: 99 };
            this.result = TuanStore.TuanCityListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
	//酒店团购关键词列表Model（zhanghd 2014-02-19）
    T.TuanKeyWordListModel = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/KeyWordList/Query';
            this.method = 'POST';
            this.param = { dataVer: 99, ver: 99 };
            this.result = TuanStore.TuanKeyWordListStore.getInstance();
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    //根据经纬度获取城市信息Model (xuweichen 2014-02-21)
    T.TuanLocalCityInfo = new cBase.Class(AbstractModel, {
        __propertys__: function () {
            this.url = '/Group/GetLocalCityInfo/Query';
            this.param = {};
            this.method = 'POST';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    return T;

})
