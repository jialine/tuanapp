define(['cBase','cStore'], function(cBase,cStore){
  "use strict";

  var MemStore = new cBase.Class({
    __propertys__: function () {
      //数据变更检查字段
      this.idField = '';
      //内存区数据
      this.data = null;
      //持久化数据
      this.store = null;
    },

    initialize: function (options) {
      //根据参数,生成cStore
      var attrs = ['key','lifeTime','useServerTime','isLocal','defaultData','rollbackEnabled'];
      var opt = {};
      for (var i = 0,ln = attrs.length; i<ln;i++){
          var val = this[attrs[i]];
          if( typeof val !== 'undefined'){
            opt[attrs[i]] = val;
          }
      }
      this.store = new cStore(opt);
      },

    refresh:function(){
      var storeData  = this.store.get();
      //内存区为空 && 持久化区有数据，复制数据到内存区
      //内存区数据不为空 && 内存区标识值不同于持久层，复制数据
      if((!this.data && storeData)&&
        (this.data && this.data[this.idField] !== storeData[this.idField])){
        this.data = storeData;
      }
    },

    commit:function(){
      this.store.set(this.data);
    },

    rollback:function(){
      this.data = null;
    },

    set:function(data){
      this.data = data;
    },

    setAttr:function(attrName,attrValue){
      this.data[attrName] = attrValue;
    },

    set2Store:function(data){
      this.set(data);
      this.commit();
    },

    get: function(){
      return this.data;
    },

    getAttr: function(attrName){
      return this.data[attrName];
    }
  });

  MemStore.getInstance = function () {
      if (this.instance) {
          return this.instance;
      } else {
          return this.instance = new this();
      }
    };
  return MemStore;
});