/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  组件Member
 * @see: http://git.dev.sh.ctripcorp.com/cmli/ctrip-h5-document/blob/master/widget/t.widget.member.md
 *
 */
define(['cUtility', 'cWidgetFactory', 'cHybridFacade'], function (Util, WidgetFactory, Facade) {
    "use strict";

    var WIDGET_NAME = 'Member';

    var LINKS = {
        // MEMBER_LOGIN: '/html5/Account/Login.html',
        MEMBER_LOGIN: '/webapp/myctrip/#account/login',
        // NON_MEMBER_LOGIN: '/html5/Account/OrderQuery.html',
        NON_MEMBER_LOGIN: '/webapp/myctrip/#account/login',
        // REGISTER: '/html5/Account/Reg.html'
        REGISTER: '/webapp/myctrip/#account/reg'
    };

    var _getLink = function (link, options) {
        if (options && options.param && typeof options.param === 'string') {
            window.location.href = link + '?' + options.param;
        } else {
            window.location.href = link;
        }
    };

    var Member = {
        memberLogin: function (options) {
            _getLink(LINKS.MEMBER_LOGIN, options);
        },

        nonMemberLogin: function (options) {
            _getLink(LINKS.NON_MEMBER_LOGIN, options);
        },

        register: function (options) {
            _getLink(LINKS.REGISTER, options);
        },

        autoLogin: function () {
            return false;
        }
    };

    var HybridMember = {
        memberLogin: function (options) {
            Facade.request({ name: Facade.METHOD_MEMBER_LOGIN, callback: options.callback });
        },

        nonMemberLogin: function (options) {
            Facade.request({ name: Facade.METHOD_NON_MEMBER_LOGIN, callback: options.callback });
        },

        register: function (options) {
            Facade.request({ name: Facade.METHOD_REGISTER, callback: options.callback });
        },

        autoLogin: function (options) {
            Facade.request({ name: Facade.METHOD_AUTO_LOGIN, callback: options.callback });
        }
    };

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: Util.isInApp() ? HybridMember : Member
    });
});
