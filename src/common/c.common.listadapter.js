/**********************************
* @author:       cmli@Ctrip.com
* @description:  ListAdapter��ListView��������
*/
define(['libs', 'cBase'], function (libs, cBase) {

    var options = options || {};

    /*************************
    * @description: ���������length���ȵ���
    * @scope: private
    */
    var _random = function (length) {
        var s = '';
        var randomchar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) return n; //1-10
            if (n < 36) return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        }
        while (s.length < length) s += randomchar();
        return s;
    }

    /*************************
    * @description: �������ظ�������룬��value���õ�hash������ȥ
    * @scope: private
    */
    var _setValue = function (map, value) {
        var randomCode = _random(8);
        if (!map.getItem(randomCode)) {
            return map.add(randomCode, value);
        } else {
            _setValue(map, value);
        }
    }

    /*************************
    * @description: ����cBase��Hash���󣬽�����ת����Hash������д洢
    * @scope: private
    */
    var _hashMap = function (map, dataList) {
        for (var i = 0; i < dataList.length; i++) {
            _setValue(map, dataList[i]);
        };
    }

    options.__propertys__ = function () {
        this.observers = [];
    }

    options.initialize = function (options) {
        this.setAdapter(options.data);
    }

    /*************************
    * @description: ����е�β���������
    * @scope: public
    */
    options.add = function (data) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                _setValue(this.map, data[i]);
                this.list.push(data[i]);
            };
        } else {
            _setValue(this.map, data);
            this.list.push(data);
        }

        this.notifyDataChanged();
    }

    /*************************
    * @description: �Ӷ��е�ͷ���޳�һ�����ݣ�ͬʱ���ظ�����
    * @scope: public
    */
    options.shift = function () {
        this.map.shift();
        this.notifyDataChanged();
        return this.list.shift();
    }

    /*************************
    * @description: �Ӷ��е�β���޳�һ�����ݣ�ͬʱ���ظ�����
    * @scope: public
    */
    options.pop = function () {
        this.map.pop();
        this.notifyDataChanged();
        return this.list.pop();
    }

    /*************************
    * @description: �Ӷ��е�β�����޳�number������
    * @scope: public
    */
    options.remove = function (number) {
        for (var i = 0; i < number; i++) {
            this.map.pop();
            this.list.pop();
        };

        this.notifyDataChanged();
    }

    /*************************
    * @description: ��handler���ص����ݽ�������
    * @scope: public
    */
    options.sortBy = function (handler) {
        this.map.sortBy(handler);
        this.list = _.sortBy(this.list, handler);

        this.notifyDataChanged();
    }

    options.setAdapter = function (dataList) {
        dataList = (dataList && dataList instanceof Array) ? dataList : [];
       // if (dataList && dataList instanceof Array) {
            this.list = $.extend(true, [], dataList);
            this.map = new cBase.Hash();
            _hashMap(this.map, dataList);
            this.notifyDataChanged();
//        } else {
//            throw "ListAdapter: set data is not array";
//        }
    }

    /********************************
    * @description: ���۲���ע�ᵽ���۲�����
    * @param: {observer} ListView �۲���ʵ��
    */
    options.regiseterObserver = function (observer) {
        if (this.observers.indexOf(observer) === -1) {
            this.observers.push(observer);
        }
    }

    /********************************
    * @description: ���۲��ߴӱ��۲����н��
    * @param: {observer} ListView �۲���ʵ��
    */
    options.unregiseterObserver = function (observer) {
        var index = this.observers.indexOf(observer)
        if (index) {
            this.observers.splice(index, 1);
        };
    }

    /********************************
    * @description: ֪ͨ�۲������ݷ����仯��Ҫ����
    */
    options.notifyDataChanged = function () {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].update();
        };
    }

    var ListAdapter = new cBase.Class(options);

    return ListAdapter;

});