'use strict';
const router = require('koa-router')();
const mvcrouter = require('../modules/koa-mvcrouter');

mvcrouter.init(router, module);

mvcrouter.viewGET('/', function (ctx) {
  console.log('----- test/被执行 ------');
  var msg = require('../lib/message');
  var res = msg.build(false,'',{}, msg.code.ok);

  return {
    //title: 'test / controller',
    content: JSON.stringify(res)
  };
});

//指定布局页
mvcrouter.viewGET('/uv', function (ctx) {
  return {
    title: 'test uv controller',
    content: 'test uv content'
  };
}, null, '', 'test');

//测试视图丢失
mvcrouter.viewGET('/tt', function (ctx) {
  return {
    title: 'test tt controller',
    content: 'test tt content'
  };
});

//RESTful GET
mvcrouter.viewGET('/rest/:id/:name', function (ctx) {
  return {
    title: 'RESTful GET action',
    content: 'rest req view test  content  id=' + JSON.stringify(ctx.params) + '     query:' + ctx.querystring
  };
}, null, 'users/index', 'test');

//RESTful PUT
mvcrouter.jsonPUT('/rest', async function (ctx) {
  return {
    res: 'RESTful PUT action',
    reqData: ctx.request.body
  };
});

//RESTful DELETE
mvcrouter.jsonDELETE('/rest/:id', async function (ctx) {
  return {
    res: 'RESTful DELETE action',
    id: ctx.params.id,
    reqData: ctx.request.body
  };
});

//测试RESTful PUT
mvcrouter.jsonGET('/restput', async function (ctx) {
  let httpSync = require('../lib/http-sync');
  let res = await httpSync.putJSON('http://localhost:3000/test/rest', { val1: 123, val2: 'test put' });
  return res;
});

//测试RESTful DELETE
mvcrouter.jsonGET('/restdel', async function (ctx) {
  let httpSync = require('../lib/http-sync');
  let res = await httpSync.deleteJSON('http://localhost:3000/test/rest/22', { val1: 222, val2: 'test delete' });
  return res;
});

//测试响应文本
mvcrouter.textGET('/text', function (ctx) {
  return 'aaaaabbbb111xxx';
});

//测试GET响应JSON 且 远程获取
mvcrouter.jsonGET('/json', async function (ctx) {
  let httpSync = require('../lib/http-sync');
  let res = httpSync.postJSON('http://localhost:3001/test/json', { val1: 123, val2: 'abc' });
  return res;
}, { val: 111, action: 'jsonGet' });

//测试POST响应JSON
mvcrouter.jsonPOST('/json', function (ctx) {
  return {
    title: 'json test',
    reqData: ctx.request.body
  };
});

//测试响应文本且远程获取
mvcrouter.textGET('/req', async function (ctx) {
  let httpSync = require('../lib/http-sync');
  let url = 'https://www.baidu.com';
  let res = await httpSync.get(url);
  return JSON.stringify(res);
});

//测试写日志
mvcrouter.textGET('/log/:text', async function (ctx) {
  let log = require('../lib/log')('test');
  log.cDebug(ctx.params, Math.random(), 123, 'ddd');
  log.fDebug(ctx.params);
  return 'ok';
});


module.exports = router;
