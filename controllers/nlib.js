'use strict';
const router = require('koa-router')();
const mvcrouter = require('../modules/koa-mvcrouter');
const nlib = require('../modules/nlib');

mvcrouter.init(router, module);

//index controller中建议只写此action
mvcrouter.jsonGET('/retmsg', function (ctx) {

  var retMsg = nlib.retMsg(true, 'err',{}, nlib.retCode.paramErr);

  return retMsg;
});

module.exports = router
