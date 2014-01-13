define(function () {
    
    
    var C = function (){};
    /**
    * 日志接口对象，提供基本的日志输出
    */
    C.console = {
        ENUM_LEVEL_LOG: 1,
        ENUM_LEVEL_ERROR: 4,
        ENUM_LEVEL_ALL: 5,
        level: null,
        /**
        * 输出log
        * @param {Object..}
        */
        log: function () {
            if (this.level & this.ENUM_LEVEL_LOG) {
                console.log.apply(console, arguments);
            }
        },
        /**
        * 输出error
        * @param {Object..}
        */
        error: function () {
            if (this.level & this.ENUM_LEVEL_ERROR) {
                console.error.apply(console, arguments);
            }
        }
    };
    //默认打开所有的log
    C.console.level = C.console.ENUM_LEVEL_ALL;  
    return C;  
});