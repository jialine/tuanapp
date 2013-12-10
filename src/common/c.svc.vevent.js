define(['libs', 'cBase', 'cStorage', 'cAjax', 'cUtility'], function (libs, cBase, cStorage, CAjax, cUtility) {
    var C = cBase;
    C.utils = cUtility;
    var CStore = cStorage.localStorage;
    var SVE = {};
    SVE.SvcVEvent = {
        baseUrl: '',
        getCityInfo: function () {
            var cityinfo = CStore.get('VEVENTCITYINFO');
            if (!cityinfo) {
                cityinfo = { City: 'sanya', CityName: '三亚', DepartCity: '2', SourceId: 3454 };
            }
            if (typeof cityinfo === 'string' && cityinfo.charAt(0) === '{') cityinfo = JSON.parse(cityinfo);
            return cityinfo;
        },
        setCityInfo: function (obj) {
            var cityinfo = SVE.SvcVEvent.getCityInfo();
            obj = obj || {};
            for (var i in obj) {
                cityinfo[i] = obj[i];
            }
            //$.merge(cityinfo, obj);
            CStore.set('VEVENTCITYINFO', cityinfo, new C.Date().addDay(15).valueOf());
        },
        /* 获得门票列表数据 */
        getAjaxResourceList: function (pinyin, callback, error) {
            var url = SVE.SvcVEvent.baseUrl + '/html5/Vacation/GetProVacationList/' + pinyin,
            params = {};
            return CAjax.post(url, params, function (json) {
                if (json.ServerCode == 1) {
                    var data = json.Data && json.Data.length ? C.utils.JsonArrayToObject(json.Data)[0] : null;
                    callback(data, json);
                } else {
                    error && error(json);
                }
            }, function (e) {
                error && error(e);
            });
        },
        getResourceList: function (params, callback, error) {
            var key = 'RESOURCELISTDATA',
                data = CStore.get(key);
            if (data) {
                callback && callback(data);
            } else {
                return SVE.SvcVEvent.getAjaxResourceList(params, function (data) {
                    CStore.set(key, data, new C.Date().addMinutes(3).valueOf());
                    callback && callback(data);
                }, error);
            }
        },
        getAjaxResourceDetail: function (params, callback, error) {
            var url = '/html5/Vacation/GetVacationDetail';
            params = params || { DepartCityId: 2, Id: 2 };
            return CAjax.post(url, params, function (json) {
                if (json.ServerCode == 1) {
                    callback(C.utils.JsonArrayToObject(json.Data)[0], json);
                } else {
                    error && error(json);
                }
            }, function (e) {
                error && error(e);
            });
        },
        getResourceDetail: function (params, callback, error) {
            var key = 'REROURCEDETAILDATA',
                json = CStore.get(key),
                paramsStr = JSON.stringify(params);
            if (json && json.params === paramsStr) {
                callback && callback(json.data);
            } else {
                return SVE.SvcVEvent.getAjaxResourceDetail(params, function (data) {
                    var json = {
                        data: data,
                        params: paramsStr
                    };
                    CStore.set(key, json, new C.Date().addMinutes(3).valueOf());
                    callback && callback(data);
                }, error);
            }
        },
        setPromotionInfo: function (PromotionInfo, resid) {
            if (PromotionInfo && resid) PromotionInfo.ResourceId = resid;
            CStore.set('PROMOTIONINFO', PromotionInfo);
        },
        getPromotionInfo: function (resid) {
            var pinfo = CStore.get('PROMOTIONINFO');
            if (resid && pinfo && resid !== pinfo.ResourceId) return null;
            return pinfo;
        },
        getVerifyCode: function (mobile, callback, error) {
            var url = '/html5/ClientData/GetVerifyCode/';
            var params = {
                Mobile: mobile,
                CodeType: 2
            };
            return CAjax.post(url, params,
            function (data) {
                callback(data);
            },
            function (e) {
                console.log('error:' + e);
                typeof error == 'function' && error(e);
            });
        },

        checkVerifyCode: function (mobile, verifyCode, callback, error) {
            var url = '/html5/Custom/CheckVerifyCode';
            var params = {
                Mobile: mobile,
                VerifyCode: verifyCode
            };
            return CAjax.post(url, params,
            function (data) {
                callback(data);
            },
            function (err) {
                typeof error == 'function' && error(err);
            });
        },

        getVEventOrders: function (mobile, verifycode, callback, error) {
            var url = '/html5/Custom/GetTravelNonOrder';
            var params = {
                Mobile: mobile,
                VerifyCode: verifycode,
                CodeType: 2
            };
            return CAjax.post(url, params,
            function (data) {
                CStore.set('VEVENTORDERDATA',
                    data, new C.Date(new Date()).addMinutes(30));
                callback(data);
            },
            function (err) {
                typeof error == 'function' && error(err);
            });
        },
        //获取订单详情
        getTravelNonOrderDetail: function (mobile, verifycode, orderid, callback, error) {
            var url = '/html5/Custom/GetTravelNonOrderDetail';
            var params = {
                Mobile: mobile,
                VerifyCode: verifycode,
                OrderId: orderid,
                CodeType: 2
            };
            return CAjax.post(url, params,
            function (data) {
                callback(data);
            },
            function (err) {
                typeof error == 'function' && error(err);
            });
        },
        //获取资源可使用日期
        getVacationDayPrice: function (productid, ticketid, callback, error) {
            var url = '/html5/Vacation/GetVacationTicketPriceList';
            var params = {
                ProductId: productid,
                TicketId: ticketid
            };
            return CAjax.post(url, params,
            function (data) {
                callback(data);
            },
            function (err) {
                typeof error == 'function' && error(err);
            });
        },
        //提交订单
        SubmitTravelOrder: function (orderinfo, callback, error) {
            var url = '/html5/Vacation/SubmitTravelOrder';
            var tickets = [];
            for (var i = 0, len = orderinfo.tickets.length; i < len; i++) {
                if (orderinfo.tickets[i].num == 0) continue;
                tickets[i] = {
                    TicketId: orderinfo.tickets[i].ticketid,
                    UseDate: orderinfo.tickets[i].usedate,
                    Price: orderinfo.tickets[i].pricediscount,
                    PriceDiscount: orderinfo.tickets[i].price,
                    Amount: orderinfo.tickets[i].ticketamount,
                    Qty: orderinfo.tickets[i].num
                };
            }
            var params = {
                ProductID: orderinfo.productid,
                DepartCityID: this.getCityInfo().DepartCity,
                Amount: orderinfo.totalamount,
                ContactName: orderinfo.contactname,
                ContactMobile: orderinfo.contactmobile,
                ProductList: tickets,
                PromotionID: orderinfo.PromotionID
            };
            return CAjax.post(url, params,
            function (data) {
                callback(data);
            },
            function (err) {
                typeof error == 'function' && error(err);
            });
        },
        //取门票详情
        getAjaxTicketDetail: function (params, callback, error) {
            var url = '/html5/Vacation/GetVacationTicketDetail';
            params = params || { Flag: 1, TicketId: null };
            return CAjax.post(url, params, function (json) {
                if (json.ServerCode == 1) {
                    callback(json.Data, json);
                } else {
                    error && error(json);
                }
            }, function (e) {
                error && error(e);
            });
        },
        getTicketDetail: function (params, callback, error) {
            var key = 'TICKETDETAILDATA',
                json = CStore.get(key),
                paramsStr = JSON.stringify(params);
            if (json && json.params === paramsStr) {
                callback && callback(json.data);
            } else {
                return SVE.SvcVEvent.getAjaxTicketDetail(params, function (data) {
                    var json = {
                        data: data,
                        params: paramsStr
                    };
                    CStore.set(key, json, new C.Date().addMinutes(3).valueOf());
                    callback && callback(data);
                }, error);
            }
        }
    };
    return SVE;
});
