define(['libs', 'cBase', 'cStore'], function (libs, cBase, cStore) {
    var wxcsStore = (cBase.Class(cStore, {
        __propertys__: function () {
            this.key = 'WXCSHTML';
            this.lifeTime = '1D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    })).getInstance();
    var getWxcsContent = function (callback) {
        var YDWXCS = wxcsStore.get();
        var usessionid = utils.getUrlParam('usessionid'), ticket = utils.getUrlParam('ticket', true), sticket = utils.getUrlParam('sticket');
        var YDWXCS = utils.getStorage('YDWXCS');
        YDWXCS = YDWXCS ? YDWXCS : {};
        var isFoot = 1;
        var isHead = 1;
        var isLogin = 0;
        var areacode = utils.getUrlParam('AreaCode', true);
        var portaltype = utils.getUrlParam('portaltype', true);
        var portal = null;
        if (portaltype != null) {
            if (portaltype == 0 || portaltype == 1) {
                portal = 'wap';
            }
            else if (portaltype == 2) {
                portal = 'app';
            }
        }
        else if (YDWXCS && YDWXCS.data && YDWXCS.data) {
            if (YDWXCS.data.IsHead) {
                portal = 'wap';
            }
            else {
                portal = 'app';
            }
        }
        if (YDWXCS && YDWXCS.data) {
            /*如果本地存储中已经包含页脚信息，则不需要重新下发页脚*/
            if (YDWXCS.data.Foot) {
                isFoot = 0;
                if (portal == 'wap') {
                    $('#ydwxcsF').html(YDWXCS.data.Foot);
                }
            }
            if (areacode == null || areacode.length == 0) {
                areacode = YDWXCS.data.AreaCode;
            }
            isLogin = YDWXCS.data.IsLogin;

            if (!YDWXCS.data.IsFoot) {
                isFoot = 0;
            }
            if (!YDWXCS.data.IsHead) {
                isHead = 0;
            }
            if (!usessionid) {
                usessionid = YDWXCS.usessionid;
            } if (!ticket) {
                ticket = YDWXCS.ticket;
            }
            if (!sticket) {
                sticket = YDWXCS.sticket;
            }
            utils.setStorage('YDWXCS', JSON.stringify(YDWXCS));
        }
        switch (portaltype) {
            case '0':
            case '1':
                isFoot = 1;
                isHead = 1;
                break;
            case '2':
                isFoot = 0;
                isHead = 0;
                break;
            default:
                break;
        }
        var param = {
            SourceId: SALES.data.sourceid,
            Sales: SALES.data.sales,
            AreaCode: areacode,
            UseSsionid: usessionid,
            Ticket: ticket,
            IsFoot: isFoot,
            IsHead: isHead,
            IsLogin: isLogin,
            STicket: sticket
        };
        if (ticket != null && areacode != null && isLogin <= 0) {
            utils.removeStorage('USERINFO', true);
        }
        if (usessionid && ticket) {
            var backUrl = 'http://' + window.location.host + '/html5/';
            window.location.href = 'http://120.197.232.22:80/sso-core/singlesignon?backurl=' + backUrl + '&portaltype=x';
        }
        $.ajax({
            url: '/html5/Other/GetWCityData', data: param, type: 'post', dataType: 'json',
            success: function (data) {
                if (data && data.Data) {
                    SALES.timeout = data.Data.ExpiredTime;
                    SALES.timeby = true;
                    utils.setStorage('SALES', JSON.stringify(SALES));
                    var footHtml = null;
                    if (YDWXCS && YDWXCS.data && YDWXCS.data.Foot) {
                        footHtml = YDWXCS.data.Foot;
                    }
                    YDWXCS = { timeout: data.ExpiredTime, data: data.Data, timeby: 1 };
                    if (data.Data.Head) {
                        $('#ydwxcsH').html(data.Data.Head);
                        //获取城市名称，用于在机酒火车票航班时刻中显示移动无线城市的城市信息，该功能需要请其他同事在机酒火车票航班时刻查询页面中调整下
                        YDWXCS.data.CityName = $('a.cityon').html();
                    }
                    if (data.Data.Foot && portal == 'wap') {
                        $('#ydwxcsF').html(data.Data.Foot);
                    }
                    if (usessionid && ticket) {
                        YDWXCS.usessionid = usessionid;
                        YDWXCS.ticket = ticket;
                    }
                    if (sticket) {
                        YDWXCS.sticket = sticket;
                    }
                    if (data.User) {
                        var d = { timeout: data.User.ExpiredTime, data: data.User };
                        YDWXCS.data.IsLogin = 1;
                        utils.setStorage('USERINFO', JSON.stringify(d));
                    }

                    if (!YDWXCS.data.Foot) {
                        YDWXCS.data.Foot = footHtml;
                    }
                    utils.setStorage('YDWXCS', JSON.stringify(YDWXCS));
                }
            },
            error: function (err) { }
        });
    }
    return function (view) {
        getWxcsContent(function (data) {
            alert(data);
        });
    };
});