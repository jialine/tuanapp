# c.widget.inputValidator

该类提供了基本的表单验证，我们在html标签中提供验证配置，代码就会自动完成验证流程

## Html标签配置

控件不止支持input标签，select和简单标签皆可支持

        <em class="formValidate1" id="notText" data-cfg="{ requred: true, type: 'num', errorMsg: '年龄错误'}">
        <input type="text" id="idCard" class="formValidate" data-cfg="{ requred: true, type: 'idCard', errorMsg: '身份证格式错误'}" />
        <input type="text" id="num" class="formValidate" data-cfg="{ type: 'num', rangeObj: 'num|18|25'}" />
        <select id="sec" class="formValidate" data-cfg="{ requred: true, errorMsg: '必须选择学历' }">
            <option value="" selected="selected">请选择</option>
            <option value="1">专科</option>
            <option value="2">本科</option>
            <option value="3">硕士</option>
        </select>

## 基本参数

### 非空验证

        data-cfg="{ requred: true}"

### 类型验证

        data-cfg="{ requred: true, type: 'email'}"//要求非空

现在支持以下类型验证：
email、password、mobile、chinese、english、zip、date、num、cellPhone、idCard
这些验证类型可以扩展

### 正则验证

如果以上不满足需求，就可以使用正则验证了

        <input type="text" class="formValidate" data-cfg="{ regexObj: /^[1-9]*[1-9][0-9]*$/ }" />

### 范围验证

控件提供数字、日期、字符串长度验证

        <input type="text" id="num" class="formValidate" data-cfg="{ type: 'num', rangeObj: 'num|18|25'}" />

该控件验证表示：1必须是数字、2必须在18和25之间

### 对比验证

控件提供基本的对比验证

        <input type="text" id="pwd" class="formValidate" data-cfg="{ requred: true, type: 'password'}" />
        <input type="text" id="rePwd" class="formValidate" data-cfg="{ compareObj: 'str|pwd|=', requred: true}" />

        <input type="text" id="d_start" class="formValidate" data-cfg="{ type: 'num', compareObj: 'num|d_end|<', errorMsg: '薪水范围错误'  }" />
        <input type="text" id="d_end" class="formValidate" data-cfg="{ compareObj: 'num|d_start|>', errorMsg: '薪水范围错误', type: 'num', msgPosition: 'bottom' }" />

### 错误信息

控件可定制错误信息

## 方法

### initialize
构造函数调用的地方，里面可以做一些初始化操作，注意我们使用时候需要传入需要验证的标签，不传入默认找class为formValidate的标签

### init
初始化验证控件

### initItem
初始化每项

### validate
具体验证

### funcValidate
验证的方法

### showMsg
控件提供的自主提示框，用户可选择不使用

### validateAll
最终的验证方法，该方法会传入三个参数，依次是成功时候调用/失败时候调用/作用域

        this.f.validateAll(function () { }, function (args) {
            for (var i = 0, len = args.length; i < len; i++) {
                args[i].el.parent().addClass('cui-input-error');
            }
            var s = '';
        });

### removeValidator
取消某一项的验证

### addValidator
临时增加一项验证

### getValidatorState
获得验证状态

## demo

demo文件地址：
http://localhost/webapp/taxi/d.html#demoinput
