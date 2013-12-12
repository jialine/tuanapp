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
