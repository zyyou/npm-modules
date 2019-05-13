'use strict';
const mvcrouter = require('../modules/koa-mvcrouter');

const httpSync = require('../modules/https-sync');

//测试响应文本且远程获取
mvcrouter.textGET('/req', async function (ctx) {
  //let url = 'https://www.baidu.com';
  let url = 'http://192.168.70.121:9001/cacheqqq';  //测试404
  let res = await httpSync.get(url,{}, 1000);
  return JSON.stringify(res);
});

module.exports = mvcrouter;
