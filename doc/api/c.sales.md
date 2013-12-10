# sales


封装了一系列关于渠道信息的方法,如根据渠道信息替换App下载地址和电话号码等

## Method

### replaceContent

replaceContent(Dom)

替换Dom中的电话号码,下载地址为渠道配置信息中的内容.
替换是根据特定的class找到指定元素的.

*'__hreftel__' 链接中的电话
*'__conttel__' 内容中的电话
*'__appaddress__' app下载地址

### setSales

保存原始的渠道信息,一般是在url中获取的参数

### getSales

获得原始的渠道信息,一般是在url中获取的参数

### getSalesObject

getSalesObject(salesName,succesCallBack,errCallback)

根据渠道号或者渠道ID从服务端获取渠道详细信息

### setUnion

保存分销联盟信息

### setSourceId

设置SourceId