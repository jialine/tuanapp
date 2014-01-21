/**
 * @author cmli@ctrip.com
 * @class console
 * @comment 2014/1/21 zhoutao看看谁会不是有哪里用到，没有用直接干掉
 */
define(function() {

  var Base = {};

  /** 声明Base.console对象 */
  Base.console = {};

  Base.console.ENUM_LEVEL_LOG = 1;
  Base.console.ENUM_LEVEL_ERROR = 4;
  Base.console.ENUM_LEVEL_ALL = 5;

  Base.console.level = null;

  /**
   * @method Base.console.log
   * @description 日志接口对象，提供基本的日志输出
   */
  Base.console.log = function(){
    if (Base.console.level === Base.console.ENUM_LEVEL_LOG) {
      console.log.apply(console, arguments);
    }
  };

  /**
   * @method Base.console.log
   * @description 日志接口对象，输出错误信息
   */
  Base.console.error = function(){
    if (Base.console.level === Base.console.ENUM_LEVEL_ERROR) {
      console.error.apply(console, arguments);
    }
  };

  /** 默认打开所有的log */
  Base.console.level = Base.console.ENUM_LEVEL_ALL;

  return Base;
});