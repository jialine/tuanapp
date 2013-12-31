define(['cBase', 'cUICore', 'cWidgetFactory', 'cValidate', 'libs'], function (cBase, cUICore, WidgetFactory, validate) {
    "use strict";

    var WIDGET_NAME = 'InputValidator';

    // 如果WidgetFactory已经注册了ListView，就无需重复注册
    if (WidgetFactory.hasWidget(WIDGET_NAME)) {
        return;
    }

    /**
    * 显示控件，初始化时传入title与html即可
    */
    var InputValidator = new cBase.Class(cUICore.Layer, {
        __propertys__: function () {
            this.TypeMsg = {
                idCard: '身份证格式错误',
                num: '不是数字',         //数字
                email: 'email格式错误',
                phone: '手机格式错误',
                chinese: '不是中文', //2-6位中文
                password: '密码格式错误' //6-32位密码验证
            };
            this.validatorArr = {};
        },
        initialize: function ($super, opts) {
            opts = opts || {};
            $super(opts);

            this.requredMsg = opts.requredMsg || '该项必填';
            this.rangeMsg = opts.rangeMsg || '您输入的字符范围错误';
            this.regexMsg = opts.regexMsg || '格式错误';
            this.compareMsg = opts.compareMsg || '对比不成立';
            this.els = opts.els || $('.formValidate'); //需要验证的控件
            this.msgPosition = opts.msgPosition || 'bottom'
            //是否显示错误信息
            this.isShowMsg = opts.isShowMsg || false;

            this.init();
        },
        init: function () {
            for (var i = 0, len = this.els.length; i < len; i++) {
                var el = $(this.els[i]);
                this.initItem(el);
            }
        },
        initItem: function (el, insertType) {
            var scope = this;
            if (typeof el == 'string') el = $('#' + el);

            //如果不存在cfg信息则直接退出后续流程
            var cfg = el.attr('data-cfg');
            if (!cfg || cfg.length == 0) return false;

            //            cfg = JSON.parse(cfg);
            cfg = eval('(' + cfg + ')');

            if (cfg.check !== false) cfg.check = true;

            //临时添加的验证，当动态添加一个input时候可以验证
            if (insertType) cfg.check = true;

            //若是未开启验证便退出该项初始化，进入下轮验证（未定义的话视为开启）
            if (cfg.check === false) return false;

            //首先定义好控件id
            cfg.id = el.attr('id') || '_' + Math.random();
            cfg.el = el;

            //该表单的验证的函数存于此
            cfg.validate = function () {
                scope.funcValidate(cfg);
            };
            this.validatorArr[cfg.id] = cfg; //生成相关验证对象

            var s = '';
        },
        validate: {
            //必填验证
            requred: function (val) {
                if (val == '') return false;
                return true;
            },
            regex: function (val, r) {
                if (r.test(val)) return true;
                return false;
            },
            range: function (val, rangeObj) {
                var rangeArr = rangeObj.split('|');
                if (rangeArr.length != 3) {
                    console.log('范围参数错误');
                    return false;
                }
                return this['_' + rangeArr[0]](val, rangeArr[1], rangeArr[2]);
            },
            _num: function (val, min, max) {
                val = parseInt(val);
                if (val > min && val < max) return true;
                return false;
            },
            _str: function (val, min, max) {
                if (val.length > min && val.length < max) return true;
                return false;
            },
            _date: function (val, min, max) {
                //日期稍后

                return true
            },
            compare: function (v1, compareObj) {
                var compareArr = compareObj.split('|');
                if (compareArr.length != 3) {
                    console.log('范围参数错误');
                    return false;
                }
                return this['_c' + compareArr[0]](v1, $('#' + compareArr[1]).val(), compareArr[2]);
            },
            _cnum: function (v1, v2, flag) {
                v1 = parseInt(v1);
                v2 = parseInt(v2);
                if (flag == '<') {
                    if (v1 < v2) return true;
                } else if (flag == '=') {
                    if (v1 == v2) return true;
                } else if (flag == '>') {
                    if (v1 > v2) return true;
                }
                return false;
            },
            _cstr: function (v1, v2, flag) {
                v1 = v1.length;
                v2 = v2.length;
                if (flag == '<') {
                    if (v1 < v2) return true;
                } else if (flag == '=') {
                    if (v1 == v2) return true;
                } else if (flag == '>') {
                    if (v1 > v2) return true;
                }
                return false;
            },
            _cdate: function (v1, v2, flag) {

                //日期暂时不管
                return true;
            }
        },
        funcValidate: function (cfg) {

            //取消事件不执行下面逻辑
            //若是没有开启验证便忽略之
            if (this.validatorArr[cfg.id] === undefined) return false;

            var val = cfg.el.val() || cfg.el.html().replace(/(^\s*)|(\s*$)/g, ""); //获取文本框的值
            var validateResult = {}; //用于保存验证结果的对象
            validateResult.isPass = true; //0初始化，1成功，-1错误
            validateResult.el = cfg.el; //保存验证对象
            validateResult.id = cfg.id; //保存验证对象
            validateResult.errorItem = {}; //保存验证失败的项目，一般只有一个

            //开启不需要验证/取消验证
            if (this.validatorArr[cfg.id].check === false) {
                this.validatorArr[cfg.id].result = validateResult;
                return false;
            }

            //首先进行非空验证
            if (cfg.requred) {
                validateResult.errorItem.requred = this.validate.requred(val);
                if (validateResult.errorItem.requred === true) validateResult.isPass = true;
                else {
                    validateResult.isPass = false;
                    //                    validateResult.msg = cfg.errorMsg || this.requredMsg;
                    validateResult.msg = this.requredMsg;
                }
            }

            //type优先，此处的type完全是一些正则表达式
            if (validateResult.isPass && typeof cfg.type == 'string' && val != '') {
                //                validateResult.errorItem[cfg.type] = this.validate.regex(val, this.regexEnum[cfg.type]);

                //此处由小熊提议使用同一套验证代码
                var type = cfg.type;
                type = 'is' + type.substr(0, 1).toUpperCase() + type.substr(1, type.length);
                validateResult.errorItem[cfg.type] = validate[type](val);

                if (validateResult.errorItem[cfg.type] === true) validateResult.isPass = true;
                else {
                    validateResult.isPass = false;
                    //                    validateResult.msg = cfg.errorMsg || this.TypeMsg[cfg.type] || '格式错误';
                    validateResult.msg = this.TypeMsg[cfg.type] || '格式错误';
                }
            }

            //当第一步验证通过便执行自身正则验证
            if (validateResult.isPass && cfg.regexObj && val != '') {
                //当未指定type时候，便执行页面中的正则表达式对象
                validateResult.errorItem.regex = this.validate.regex(val, cfg.regexObj);
                if (validateResult.errorItem.regex === true) validateResult.isPass = true;
                else {
                    validateResult.isPass = false;
                    validateResult.msg = cfg.errorMsg || this.regexMsg;
                }
            }

            //当第二步验证通过便执行范围验证
            if (validateResult.isPass && cfg.rangeObj && val != '') {
                validateResult.errorItem.range = this.validate.range(val, cfg.rangeObj);
                if (validateResult.errorItem.range === true) validateResult.isPass = true;
                else {
                    validateResult.isPass = false;
                    validateResult.msg = cfg.errorMsg || this.rangeMsg;
                }
            }

            //第三步执行对比运算，由于id未必唯一，此处需要注意
            if (validateResult.isPass && cfg.compareObj && val != '') {
                validateResult.errorItem.compare = this.validate.compare(val, cfg.compareObj);
                if (validateResult.errorItem.compare === true) validateResult.isPass = true;
                else {
                    validateResult.isPass = false;
                    validateResult.msg = cfg.errorMsg || this.compareMsg;
                }
            }
            this.validatorArr[cfg.id].result = validateResult;
        },
        showMsg: function (errorArr) {
            if (this.msgTimer) clearTimeout(this.msgTimer);
            var body = $('body')
            for (var i = 0, len = errorArr.length; i < len; i++) {
                var tips = $('#' + errorArr[i].id + 'Tips');
                if (!tips[0]) {
                    tips = $('<div class="validateTips validateError" id="' + errorArr[i].id + 'Tips"><div class="triangle_icon"><div class="before"></div><div class="after"></div></div>' + errorArr[i].msg + '</div>');

                    var offset = errorArr[i].el.offset();
                    var height = parseInt(errorArr[i].el.height());
                    var width = parseInt(errorArr[i].el.width());
                    var l = offset.left;
                    var t = offset.top;

                    if (this.msgPosition == 'bottom') {
                        tips.addClass('posBottom');
                        t += height + 4;
                    } else if (this.msgPosition == 'right') {
                        tips.addClass('posRight');
                        l += width + 6;
                    } else if (this.msgPosition == 'top') {
                        tips.addClass('posTop');
                        t += height * (-1) - 8;
                    }
                    tips.css({ left: l, top: t });
                    body.append(tips);
                }
            }
            //两秒后提示需要消失
            this.msgTimer = setTimeout(function () {
                $('.validateTips').remove();
            }, 3000);
        },
        validateAll: function (success, error, scope) {
            for (var k in this.validatorArr) {
                var v = this.validatorArr[k];
                v.validate();
            }
            //如果不全等于true就会返回错误的项目
            var r = this.getValidatorState();

            if (r === true) {
                typeof success == 'function' && success.call(scope);
            } else {
                if (this.isShowMsg) {
                    this.showMsg(r);
                }
                typeof error == 'function' && error.call(scope, r);
            }
        },
        removeValidator: function (id) {
            if (id && this.validatorArr[id]) {
                var sa = this.validatorArr[id];
                this.validatorArr[id]['check'] = false; //将其验证状态置为false 
                var s = '';
            }
        },
        addValidator: function (el) {
            if (typeof el == 'string') el = $('#' + el);
            this.initItem(el, 'add');
        },
        getValidatorState: function () {
            var isPass = true;
            var errorItem = []; //错误的项目
            for (var k in this.validatorArr) {
                if (this.validatorArr[k].result.isPass == false) {
                    isPass = false;
                    errorItem.push(this.validatorArr[k].result)
                }
            }
            if (isPass) return true;
            return errorItem;
        }
    });

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: InputValidator
    });


});