define(['cUtility', 'cWidgetFactory', 'cWidgetMember'], function(Util, WidgetFactory){

  test('c.widget.member.js unit test', function(){

    var Member = WidgetFactory.create('Member');
    notEqual(Member, null, 'Init Member instance successfully!');

    equal(typeof Member.memberLogin, 'function', 'Exist method: memberLogin');
    equal(typeof Member.autoLogin, 'function', 'Exist method: autoLogin');
    equal(typeof Member.nonMemberLogin, 'function', 'Exist method: nonMemberLogin');
    equal(typeof Member.register, 'function', 'Exist method: register');



    if(Util.isInApp()){

    }else{
      equal(Member.autoLogin(), false, 'autoLogin return false');
    }

  });


})