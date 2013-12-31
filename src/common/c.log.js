define(['libs'], function () {
  var recordErrorMsg = window.onerror = function (errorMsg, errorFileUrl, lineNum,col,errorObj) {

    function start(errorMsg, errorFileUrl, lineNum) {
      var error = buildErrorObj(errorMsg, errorFileUrl, lineNum);
      saveError(error);
      return false;
    };

    function buildErrorObj(errorMsg, errorFileUrl, lineNum) {
      var fileName = errorFileUrl.substr(errorFileUrl.lastIndexOf('/')+1);
      //保存Error 错误调用堆栈
      return {
        msg:   errorMsg,
        file: fileName,
        line:  lineNum,
        fullPath:  errorFileUrl,
        dt:    getDateTime(),
        url:  window.location.href,
        restful:{
          url: '',
          request:'',
          response:''
        }
      };
    };

    /**
     * 保存error对象
     * @param errorObj
     */
    function saveError(errorObj) {
      var errorStore = localStorage.getItem('ERROR_LOG'),
        errorStr = [];
      var errors = errorStore ? JSON.parse(errorStore) : [];
      //如果大于50条,删除最早的记录
      if (errors.length > 0) {
        errors.splice(50)
      }
      //新的记录放在数组的头部
      errors.unshift(errorObj);
      //序列化
      if (JSON.stringify) {
        errorStr = JSON.stringify(errors);
      } else {
        errorStr = eval('(' + errors + ')');
      }

      localStorage.setItem('ERROR_LOG', errorStr)
    };

    /**
     * 格式化当前gr时间
     * @returns {number}
     */
    function getDateTime() {
      var d = new Date();
      var dateTime = "";
      dateTime += d.getMonth() + 1;
      dateTime += '/';
      dateTime += d.getDate();
      dateTime += ' ';
      dateTime += d.getHours();
      dateTime += ':';
      dateTime += d.getMinutes();
      dateTime += ':';
      dateTime += d.getSeconds();

      return dateTime;
    };

    start(errorMsg, errorFileUrl, lineNum)
  }

  return recordErrorMsg;

});