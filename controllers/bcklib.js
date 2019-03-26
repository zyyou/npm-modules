'use strict';
const router = require('koa-router')();
const mvcrouter = require('../modules/koa-mvcrouter');
const bcklib = require('../modules/bcklib');

mvcrouter.init(router, module);

//index controller中建议只写此action
mvcrouter.jsonGET('/retmsg', function (ctx) {

  var retMsg = bcklib.retMsg(true, 'err', {}, bcklib.retCode.paramErr);

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

module.exports = router
