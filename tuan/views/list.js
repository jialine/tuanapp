define(['cCommonPageFactory', 'cCommonListPage', 'cListAdapter', TuanApp.getViewsPath('list')], function (CommonPageFactory, CommonListPage, ListAdapter, view) {
    /*
     var Page = PageView.extend({
     render: function(){
     this.$el.html(view);
     this._bindListEvents(this.$el);
     },
     _addHeaderView: function(){
     this.injectHeaderView({
     data: {
     title: '携程团购酒店',
     back: true,
     home: true,
     view: this,
     tel: true,
     events: {
     homeHandler: function (){
     this.back('index');
     },
     returnHandler: function(){
     this.back();
     }
     }
     }
     });


     },
     _openDetail: function(id){
     TuanApp.showLoading();
     location.href='#detail';
     },
     _isDetailItem: function(){

     },
     _bindListEvents: function(wrap){
     var self = this;
     wrap.find('#J_hotelList').delegate('li', 'click', function(e){

     self._openDetail($(this).attr('data-id'));
     });
     },
     onCreate: function(){
     this.render();
     this._addHeaderView();

     this.headerview.show();

     },
     onLoad: function(){
     this.turning();

     }
     });
     return Page;
     */
//    require(['cCommonListPage', 'cCommonPageFactory'], function(CommonListPage, CommonPageFactory){
//        debugger;
//    });

// console.log(CommonListPage);
    var CommonListPage = CommonPageFactory.create('CommonListPage');
    //console.log(CommonListPage);
    //console.log(CommonPageFactory);

    var ListPage = CommonListPage.extend({
        render: function () {
            this.$el.html(view);
        },
        events: {
            'click #selCity': 'showCityList'
        },
        showCityList: function(){
            this.forward('citylist');
        },
        onCreate: function () {
            var self = this;

            self.render();
//            self.addHeaderView();
            this.injectHeaderView();

        },
        addHeaderView: function () {
            var self = this;
            this.headerview.set({
                //container: self.$el,
                // data: {
                title: '携程团购酒店',
                back: true,
                home: true,
                view: this,
                tel: true,
                events: {
                    homeHandler: function () {
                        this.back('index');
                    },
                    returnHandler: function () {
                        this.back();
                        //alert('已经是首页了');
                    }
                }
                //}
            });
            this.headerview.show();
        },
        showRequestLoading: function(){
            this.showBottomLoading();
            this.showLoading();
        },
        //TODO: bug, 触发两次onBottomPull
        hideRequestLoading: function(){
            this.hideBottomLoading();
            this.hideLoading();
        },
        onBottomPull: function () {
            console.log('on bottom pull');
            var self = this;
            this.showRequestLoading();
            //模拟结果返回
            setTimeout(function(){
                self.hideRequestLoading();
            }, 2000);
        },
        onLoad: function () {
            var self = this;

            self.addHeaderView();

            //这里injectListView的数据可能是从服务器来的所以可以在Model的回调中使用

            var listadapter = new ListAdapter({data: [
                {a: 1},
                {a: 2},
                {a: 3},
                {a: 4},
                {a: 5},
                {a: 6},
                {a: 7}
            ]});

            var data = {
                container: '#J_hotelList',//ListView的容器，用'#id'方式传入String,
                listadapter: listadapter,//ListAdapters实例,
                itemView: '<li class="arr_r" data-id="119281" data-len="25" data-count="1886"><%=a%>\
                  <figure class="pro_list_imgbox">\
                <img data-img="0" onerror="javascript:noPic(this);" src="http://images4.c-ctrip.com/target/tuangou/929/419/743/25f788af9d464469b5023a094db3d2a6_130_130.jpg">\
                    <figcaption class="figcaption">\
                        <span>已售30291份</span></figcaption>\
                </figure>\
                <div class="pro_list_info">\
                   <h4 class="pro_list_tit ellips_line2">新春如家莫泰99元多店通用（多房型）</h4> \
                   <p class="pro_list_rank"> </p> \
                   <p class="pro_list_oldprice" data-discount="4.5"><del data-price="219">原价¥219</del> 4.5折</p>\
                   <div class="pro_list_prv">\
                       <p class="pro_list_price">¥<i>99</i>\
                       </p>\
                   </div>\
               </div> \
                   </li>',//每一个Item View的模板,
                bindItemViewEvent: function ($el) {
                    $el.bind('click', function (e) {
                        self.forward('detail');
                    });
                    // $el是每个Item View，需要对ItemView进行事件绑定在这里做
                }
            }

            this.injectListView(data);

            this.listview.show();

            this.turning();
        }
    });
    return ListPage;


});