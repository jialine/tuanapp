## Ctrip.H5.Lizard

-------------------------

Ctrip.H5.Lizard是面向移动端Web、Hybrid App和WebApp开发的前端框架。遵循CommonJS标准，将Javasript做模块化封装，采用requirejs作为模块加载器。依赖zepto构建底层库，在其之上架构MVC框架，封装网络访问、本地数据库操作等基础操作。提供Ctrip Mobile风格的前端UI库和面向多种环境的Widget功能组件库。

Lizard是一种两栖动物，就像Ctrip.H5.Lizard所提供的功能一样，可以在移动网站的web和Hybrid App中应用，其开发是多维度的。

### Ctrip.H5.Lizard的结构

-------------------------

Ctrip.H5.Lizard主要由四个模块构成：第三方框架、核心框架、公共组件库、业务组件库

**第三方框架**

Ctrip.H5.Lizard底层依赖的第三方库有4个：zepto, underscore, backbone, fastclick

  + 在mobile端，Ctrip.H5.Lizard会加载zepto，在PC端考虑到兼容性的问题，IE内核浏览器会采用jquery，Ctrip.H5.Lizard可以做到对环境自适应进行加载。

  + backbone在Ctrip.H5.Lizard是被定制的，其MVC框架中的Model和Controller的内容根据Ctrip.H5.Lizard适用的环境被复写。

  + Ctrip.H5.Lizard抽取了fastclick的核心代码，复写了移动端的click事件

**核心框架**

Ctrip.H5.Lizard实现了WebApp的基础功能：

  + 在Javascript中实现了面向对象编程(OOP)的基础

  + 封装了ajax请求，处理了本地环境下的跨域访问，并对请求做了缓存处理

  + 参考了redis模型，在本地实现了简单的文档型数据库模型。设置了数据的过期时间、缓冲区。

  + 通过监控Hash的变化，实现View的无缝切换

**公共组件库**

Ctrip.H5.Lizard的公共组件库涵盖了两个模块组: UI组件库和Widget组件库

  + UI组件库；以特定的样式表为基础，定制Ctrip Mobile的UI组件，实现了各种交互 – 电话、时间选取等

  + Widget组件库：提供了功能性组件库和UI业务组件库

**业务组件库**

Ctrip.H5.Lizard的业务组件库提供了注册、登陆、支付等与业务性相关的功能性组件

### Ctrip.H5.Lizard的Hybrid模式

-------------------------

Ctrip.H5.Lizard可以自动侦测当前运行的环境是Hybrid App还是Web站点，根据当前的环境自动加载Hybrid面板。Hybrid面板封装了Ctrip App提供的API

### Ctrip.H5.Lizard发展构想

-------------------------

  + 将Backbone中Events事件绑定机制在框架层重写，去除代码对于Backbone的依赖

  + 定制zepto，剔除不常用的内容，进一步减少代码对于框架依赖，逐步向去框架化方向发展

  + 去除对现有业务逻辑的依赖 – 实现可配置模式

  + 以多态方式封装本地存储，支持多种本地存储方式
