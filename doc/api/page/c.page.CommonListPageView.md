# CommomListPageView

继承于BasePageView, 封装了ListVew，用以实现列表页面的显示，同是封装了滚动条事件，在滚动到页面底部时会调用onBottomPull方法。

    var CommonListPage = CommonPageFactory.create('CommonListPage');
        var View = CommonListPage.extend({
            onCreate: function(){
                this.injectHeaderView();
             },
            onLoad: function(){
                console.log('/--------------onLoad--------------/');
                this.headerview.set(headerview_data);
                this.headerview.show();

               这里injectListView的数据可能是从服务器来的所以可以在Model的回调中使用
               var listadapter = new ListAdapter({data: data_arr});
               var data = {
                 workspace: 整个模板文件渲染出来的dom,
                 container: ListView的容器，用'#id'方式传入String,
                 listadapter: ListAdapters实例,
                 itemView: 每一个Item View的模板,
                 bindItemViewEvent: function($el){
                   $el是每个Item View，需要对ItemView进行事件绑定在这里做
                 }
               }
                this.injectListView(listview_data);
                this.listview.show();

                this.turning();
          },

          onBottomPull: function(){
            this.cashAccountInfo.setParam("pageIdx", self.pageNum);
            var param = this.cashAccountInfo.getParam();
            //数据已经加载完，停止捕获
            if(param.pageIdx == pagenum ){
                this.closeBottomPull();
            }
            //显示loading()
            this.showBottomLoading();
            this.cashAccountInfo.excute(function (data) {
                if (data.refunds.length > 0) {
                    self.listadapter.add(data.refunds);
                }
                //隐藏loading
               self.hideBottomLoading();
            }, function (error) {
                console.log("错误信息： " + error);
            });
          }
    });

## Method

### onBottomPull
onBottomPull()
listview滚动到底部时调用，子类可实现此方法，加载数据

###  showBottomLoading
showBottomLoading()
 显示底部loading图标

    this.showBottomLoading()
### hideBottomLoading
hideBottomLoading()
隐藏底部loading图标

    this.hideBottomLoading()
### closeBottomPull
通知已经加载完数据

    hideBottomLoading()
