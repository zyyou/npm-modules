'use strict';
const router = require('koa-router')();
const mvcrouter = require('../modules/koa-mvcrouter');

const httpSync = require('../modules/https-sync');

mvcrouter.init(router, module);

//测试响应文本且远程获取
mvcrouter.textGET('/req', async function (ctx) {
  let url = 'https://www.baidu.com';
  let res = await httpSync.get(url);
  return JSON.stringify(res);
});

module.exports = router
