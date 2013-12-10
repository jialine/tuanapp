define(['libs'], function () {
    var recordErrorMsg = window.onerror = function (errorMsg, errorFileUrl, errorLineNumber) {
        var d = new Date();
        var getdatetimes = d.getFullYear()
        getdatetimes += '/';
        getdatetimes += d.getMonth() + 1;
        getdatetimes += '/';
        getdatetimes += d.getDate();
        getdatetimes += ' ';
        getdatetimes += d.getHours();
        getdatetimes += ':';
        getdatetimes += d.getMinutes();
        getdatetimes += ':';
        getdatetimes += d.getSeconds();
        getdatetimes += ':';
        getdatetimes += d.getMilliseconds();

        if (localStorage['DevErrorLog']) {
            var getErrorLog = localStorage['DevErrorLog'],
				parseErrorLog = $.parseJSON(getErrorLog),
				ErrorArrayItems = { errorMsg: errorMsg, errorFileUrl: errorFileUrl, errorLineNumber: errorLineNumber, getdatetimes: getdatetimes };
            parseErrorLog.unshift(ErrorArrayItems);

            if (parseErrorLog.length > 50) {
                parseErrorLog.splice(50)
            }

            var setErrorLog = JSON.stringify(parseErrorLog);
            localStorage['DevErrorLog'] = setErrorLog;


        } else {
            var storageErrorArray = [],
				ErrorArrayItems = { errorMsg: errorMsg, errorFileUrl: errorFileUrl, errorLineNumber: errorLineNumber, getdatetimes: getdatetimes };
            storageErrorArray.unshift(ErrorArrayItems);
            var storageArrayStringify = JSON.stringify(storageErrorArray);
            localStorage['DevErrorLog'] = storageArrayStringify;

        };

        return false;
    }

    return recordErrorMsg;
   // return {
     //   recordErrorMsg: recordErrorMsg
    //}
});