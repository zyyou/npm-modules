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
  let config;

  config = bcklib.config.load();
  console.log('config:', config);

  config = bcklib.config.load('common.js', true);
  console.log('common:', config);

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


mvcrouter.textGET('/utils', async function (ctx) {

  let res = '---';

  res += '\r\n' + bcklib.valueUtils.notNullStr('abc');
  res += '\r\n' + bcklib.valueUtils.notNullStr(undefined);
  res += '\r\n' + bcklib.valueUtils.notNullStr(new Date());
  res += '\r\n' + bcklib.valueUtils.notNullStr(null);
  res += '\r\n' + bcklib.valueUtils.notNullStr(1.0);
  res += '\r\n' + bcklib.valueUtils.notNullStr(true);
  res += '\r\n' + bcklib.valueUtils.notNullStr([]);
  res += '\r\n' + bcklib.valueUtils.notNullStr(function () { });
  res += '\r\n' + bcklib.valueUtils.notNullStr({});
  res += '\r\n-----';

  res += '\r\n' + bcklib.valueUtils.subStrRight('abc123ddd', 4);
  res += '\r\n' + bcklib.valueUtils.subStrRight('ddd', 4);
  res += '\r\n' + bcklib.valueUtils.subStrRight(5, 4);
  res += '\r\n-----';

  return res;
});

module.exports = mvcrouter;
