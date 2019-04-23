'use strict';
const moment = require('moment');
const mvcrouter = require('../modules/koa-mvcrouter');
const bcklib = require('../modules/bcklib');

//index controller中建议只写此action
mvcrouter.jsonGET('/retmsg', function (ctx) {

  var retMsg = bcklib.retMsg(true, 'err', '', bcklib.retCode.paramErr);

  return retMsg;
});

mvcrouter.jsonGET('/cip', function (ctx) {

  var retMsg = bcklib.retMsg(false, 'ok', { ip: bcklib.cutils.getClientIP(ctx.req) });

  return retMsg;
});

mvcrouter.jsonGET('/config', function (ctx) {

  var config = bcklib.loadConfig();

  console.log('config:', config);

  //config = bcklib.loadConfig('logconf.json');

  return config;
});

mvcrouter.jsonGET('/log', function (ctx) {

  bcklib.log.cDebug('ddddddd', 123, { a: 1 }); //控制台 debug 日志 
  bcklib.log.cWarn('wwwwwww', 123, { a: 1 }); //控制台 warn 日志
  bcklib.log.cError('eeeeeee', 123, { a: 1 }); //控制台 error 日志

  bcklib.log.fDebug('ddddddd', 123, { a: 1 }); //文件 debug 日志 
  bcklib.log.fWarn('wwwwwww', 123, { a: 1 }); //文件 warn 日志
  bcklib.log.fError('eeeeeee', 123, { a: 1 }); //文件 error 日志

  return {};
});

mvcrouter.jsonGET('/cache', async function (ctx) {

  let res;

  //是否存在key，存在返回1，不存在0
  res = await bcklib.cache.exists('bcktest');
  console.log('exists:', res);
  //设置成功返回OK
  //res = await bcklib.cache.set('bcktest', '123123aaaaaa ' + moment().format('YYYY-MM-DD HH:mm:ss'));
  res = await bcklib.cache.set('bcktest', '123123aaaaaa ' + moment().format('YYYY-MM-DD HH:mm:ss'), 20);
  console.log('set:', res);
  //返回值字符串
  res = await bcklib.cache.get('bcktest');
  console.log('get:', res);
  //计数
  res = await bcklib.cache.incr('testincr');
  console.log('incr:', res);
  //返回计数值
  res = await bcklib.cache.get('testincr');
  console.log('get incr:', res);

  return {};
});

mvcrouter.textGET('/utils', async function (ctx) {

  let res = '---';

  res += '\r\n' + bcklib.sutils.notNullStr('abc');
  res += '\r\n' + bcklib.sutils.notNullStr(undefined);
  res += '\r\n' + bcklib.sutils.notNullStr(new Date());
  res += '\r\n' + bcklib.sutils.notNullStr(null);
  res += '\r\n' + bcklib.sutils.notNullStr(1.0);
  res += '\r\n' + bcklib.sutils.notNullStr(true);
  res += '\r\n' + bcklib.sutils.notNullStr([]);
  res += '\r\n' + bcklib.sutils.notNullStr(function () { });
  res += '\r\n' + bcklib.sutils.notNullStr({});
  res += '\r\n-----';

  return res;
});

module.exports = mvcrouter;
