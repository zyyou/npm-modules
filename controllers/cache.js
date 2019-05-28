'use strict';
const moment = require('moment');
const mvcrouter = require('../modules/koa-mvcrouter');

const cache = require('../modules/cache-ioredis');

//测试响应文本且远程获取
mvcrouter.textGET('/', async function (ctx) {

  let res;

  //是否存在key，存在返回1，不存在0
  res = await cache.exists('bcktest');
  console.log('exists:', res);
  //设置成功返回OK
  res = await cache.set('bcktest', '123123aaaaaa ' + moment().format('YYYY-MM-DD HH:mm:ss'), 20);
  console.log('set:', res);
  //返回值字符串
  res = await cache.get('bcktest');
  console.log('get:', res);
  //计数
  res = await cache.incr('testincr');
  console.log('incr:', res);
  //返回计数值
  res = await cache.get('testincr');
  console.log('get incr:', res);

  return 'ok';
});

module.exports = mvcrouter;
