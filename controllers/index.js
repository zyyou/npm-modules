'use strict';
const router = require('koa-router')();
const mvcrouter = require('../modules/koa-mvcrouter');

mvcrouter.init(router, module);

//index controller中建议只写此action
mvcrouter.viewGET('/', function (ctx) {
  return {
    title: 'zyy'
  };
});

//该action会被test/替代
mvcrouter.viewGET('/test', function (ctx) {
  console.log('----- index/test被执行 ------')
  return {
    title: 'index  test',
    //content: 'index  test'
  };
});

module.exports = router
