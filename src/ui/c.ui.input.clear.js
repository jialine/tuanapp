define(['libs', 'cBase'], function (libs, cBase) {

  /**
  *  输入框清除按键
  *  @type Function
  *  @param input {String|jQuery|Element} 要设置的输入框
  *  @param clearClass {String} 自定义class
  *  @param clearCallback 清空后回调
  */

  /*判断浏览器是否支持placeholder*/
  var isPlaceHolder = 'placeholder' in document.createElement('input');

  var _offsetObj = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
  };

  var _setElOffset = function (el, offset) {
    for (var key in _offsetObj) {
      if (offset[key]) {
        var objStr = '{' + key + ':' + offset[key] + 'px, ' + _offsetObj[key] + ':auto' + '}';
        el.css($.parseJSON(objStr));
      }
    }
  };

  var options = {};

  options.__propertys__ = function () {
  };

  options.initialize = function (input, clearClass, clearCallback, offset) {
    clearClass || (clearClass = '');
    offset = offset || {}
    var $input = typeof input == 'string' ? $(input) : input;

    $input.each(function () {
      var clearButton = $('<a class="clear-input ' + clearClass + '" href="javascript:;"><span></span></a>'),
                $input = $(this);
      _setElOffset(clearButton, offset);

      $input.parent().addClass('clear-input-box');
      if (!isPlaceHolder) {
        var placeholder = $input.attr('placeholder'),
                    placeholderNode = $('<span class="placeholder-title' + (clearClass ? ' placeholder-' + clearClass : '') + '">' + placeholder + '</span>');
      }
      clearButton.hide();
      $input.bind({
        'focus': function () {
          var val = $.trim($input.val());
          if (val != '') {
            clearButton.show();
          }
        },
        'input': function () {
          window.setTimeout(function () {
            var val = $input.val();
            if (val == '') {
              clearButton.hide();
            } else {
              clearButton.show();
            }
            if (!isPlaceHolder) {
              if (val == '') {
                placeholderNode.show();
              } else {
                placeholderNode.hide();
              }
            }
          }, 10)
        },
        'blur': function () {
          var val = $.trim($input.val());
          if (!isPlaceHolder) {
            if (val == '') {
              placeholderNode.show();
            } else {
              placeholderNode.hide();
            }
          }
          setTimeout(function () {
            clearButton.hide();
          }, 300);
        }
      });
      clearButton.bind('click', function () {
        $input.val('');
        $input.keyup();
        clearButton.hide();
        $input.focus();
        $input.trigger('input');
        typeof clearCallback == 'function' && clearCallback.call(this);
      });
      $input.after(clearButton);
      if (!isPlaceHolder) {
        $input.after(placeholderNode);
        placeholderNode.bind('click', function () {
          $input.focus();
        });
      }
      $input.blur();
    });
  };

  var InputClear = function (input, clearClass, clearCallback, offset) {
    var InputClear1 = cBase.Class(options);
    new InputClear1(input, clearClass, clearCallback, offset);
  }

  return InputClear;

});