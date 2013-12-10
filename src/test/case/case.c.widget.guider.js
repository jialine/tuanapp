define(['cUtility', 'cWidgetFactory', 'cWidgetGuider'], function(Util, WidgetFactory){

  test('c.widget.member.js unit test', function(){

    var Guider = WidgetFactory.create('Guider');
    notEqual(Guider, null, 'Init Guider instance successfully!');

    equal(typeof Guider.jump, 'function', 'Exist method: jump');
    equal(typeof Guider.apply, 'function', 'Exist method: apply');
    equal(typeof Guider.call, 'function', 'Exist method: call');
    equal(typeof Guider.init, 'function', 'Exist method: init');

    if(Util.isInApp()){


    }else{
      var value = 1;
      Guider.apply({callback: function(){
        value = 2;
        equal(value, 2, 'execute apply callbak successfully');
      }});

      Guider.call({url: 'ctrip://wireless'});

      var ifr = document.getElementById('h5-hybrid-caller');
      equal(ifr.src, 'ctrip://wireless', 'execute call successfully');

      Guider.call({url: 'ctrip://wireless/fake'});
      equal(ifr.src, 'ctrip://wireless/fake', 'execute call after iframe init');

      Guider.call({url: 'ctrip://wireless/fake'});
      equal(ifr.src, 'ctrip://wireless/fake', 'execute call when url is same');

      equal(Guider.init(), false, 'execute init and return false');
    }

  });
})