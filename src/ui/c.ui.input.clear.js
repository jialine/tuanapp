define(['libs', 'cBase'], function (libs, cBase) {

  var InputClear = (function () {
    var isPlaceHolder = 'placeholder' in document.createElement('input');
    /*判断浏览器是否支持placeholder*/
    var InputClear = function (input, clearClass, clearCallback, offset) {
      clearClass || (clearClass = '');
      offset = offset || {}
      var $input = typeof input == 'string' ? $(input) : input;
      $input.each(function () {
        var clearButton = $('<a class="clear-input ' + clearClass + '" href="javascript:;"><span></span></a>'),
                $input = $(this);
        if (offset.left) {
          clearButton.css({
            left: offset.left + 'px',
            right: 'auto'
          });
        }
        if (offset.top) {
          clearButton.css({
            top: offset.top + 'px',
            bottom: 'auto'
          });
        }
        if (offset.right) {
          clearButton.css({
            right: offset.right + 'px',
            left: 'auto'
          });
        }
        if (offset.bottom) {
          clearButton.css({
            bottom: offset.bottom + 'px',
            top: 'auto'
          });
        }
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
            },
                        300);
          }
        });
        clearButton.bind('click',
                function () {
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
          placeholderNode.bind('click',
                    function () {
                      $input.focus();
                    });
        }

        $input.blur();
      });
    };
    return InputClear;
  })();

  return InputClear;

});