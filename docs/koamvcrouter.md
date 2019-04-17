## 说明
koa2 mvc 路由

## 安装到工程
```shell
npm i koa-mvcrouter -S
```

## 引用
```shell
const mvcrouter = require('koa-mvcrouter');
```

## 加载路由
app.js中
```javascript
app.use(mvcrouter.load());
```

## 工程结构
controllers存放路由（控制器），views 存放视图，views/_layout 存放布局页
自动匹配views目录下于controller同名目录下action同名的视图
自动匹配_layout目录下default.ejs
```
project
    node_modules
    controllers
        test.js
    views
        _layout
            default.ejs
            default.h5.ejs
        test.ejs
```

## 控制器（路由）示例
```javascript

const mvcrouter = require('../modules/koa-mvcrouter');

mvcrouter.viewGET('/', function (ctx) {
  return {
    title: '这是一个GET视图响应'
  };
});

mvcrouter.viewGET('/uv', function (ctx) {
  return {
    title: '这这里自定义test布局'
  };
}, null, '', 'test');

mvcrouter.viewGET('/rest/:id/:name', function (ctx) {
  return {
    title: 'RESTful GET action',
    content: '自定义视图和布局页'
  };
}, null, 'users/index', 'test');

mvcrouter.jsonPOST('/json', function (ctx) {
  return {
    title: 'json test',
    reqData: ctx.request.body
  };
});

mvcrouter.jsonPUT('/rest', async function (ctx) {
  return {
    res: 'RESTful PUT action',
    reqData: ctx.request.body
  };
});

mvcrouter.jsonDELETE('/rest/:id', async function (ctx) {
  return {
    res: 'RESTful DELETE action',
    id: ctx.params.id,
    reqData: ctx.request.body
  };
});

mvcrouter.textGET('/text', function (ctx) {
  return 'aaaaabbbb111xxx';
});

module.exports = mvcrouter;

```
## 视图数据
默认会添加ctx到视图，网站配置信息如公共title、备案号等可以写入到ctx
```javascript
let data = await action(ctx);
data = data || {};
data.title = data.title || '';
data.ctx = data.ctx || ctx;
```
