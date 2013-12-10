# c.ui.slide

图片轮播组件,继承自[c.ui.AbstractView](c.ui.core.md),建议使用[c.widget.slide](c.widget.slide.md)替代.

    var slide =  new.Slide({
            container: $('container'),
            images:[
                     {
                      title:'',
                      src:'',
                      link:''
                      }
                 ],
            autoplay: false,
            loop: false
     });
     slide.play();
## Properties

### container
slide组件的容器

### images
图片列表,接受一个数组,格式如

     images:[
         {
          title:'',
          src:'',
          link:''
          }
     ],

### defaultIndex
默认图片索引

### index
当前显示图片索引

### delay
轮播延迟,时间为毫秒

### autoplay
是否自动播放,默认为false

### loop
是否循环播放,默认为false,

### notimage
无图片显示时,显示内容

### dir
默认播放方式 left/right,默认为left

## Event

### onchange
onchange(oldPicIndex,newPicIndex)

图片切换时触发事件

### onerror
onerror(img)

图片加载失败时触发事件,img对象格式如：

    {
      title:'',
      src:'',
      link:''
     }


## Method
### play
开始播放

    slide.play()

### stop
停止播放

    slide.stop()

### next
播放至下一个图片

    slide.next()
###  pre
播放至前一个图片

    slide.pre()
###  go
go(imgIndex,[callback],[cancelAnimte])

播放至指定图片

     slide.go(2)

### empty
清空图片

     slide.empty()

