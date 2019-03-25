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

module.exports = router
