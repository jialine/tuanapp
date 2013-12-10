c.common.store
===========
此文件提供了几个Store,用以存贮用户信息和渠道信息

UserStore
========
继承自[C.Store](/c.store.md).

保存用户信息操作Store,过期时间为1天

getUser
------
getUser ==> Object

获得用户信息

setUser
-------
setUser(userInfo)==>Boolean

设置用户信息,登陆成功后,将用户数据保存

removeUser
---------
removeUser() ==>Boolean

删除当前登陆用户信息,即注销登陆

isNonUser
--------
idNonUser() ==>Boolean
是否为注册用户

isLogin
---------
isLogin() ==>Boolean 

是否已登陆

getUserName
---------
getUserName() ==> String

获得当前用户名

获得j用户名
HeadStore
========
继承自[C.Store](/c.store.md).

保存restful 服务请求的 Head部分的Store,包含用户唯一标识Auth,渠道号信息sid等

UnionStore
=======
继承自[C.Store](/c.store.md).

保存分销联盟信息Store.LocalStore Key值为UNION，过期时间为7天.

SalesStore
=========
继承自[C.Store](/c.store.md).

渠道原始参数信息的Store,LocalStore Key值为SALES,过期时间为30天.

SalesObjectStore
========
继承自[C.Store](/c.store.md).

渠道信息Store,LocalStore Key值为SALES,过期时间为30天.



