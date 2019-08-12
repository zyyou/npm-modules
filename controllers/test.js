'use strict';

const mvcrouter = require('../modules/koa-mvcrouter')();

//index controller中建议只写此action
mvcrouter.viewGET('/', function (ctx) {
  return {
    title: 'test'
  };
});


module.exports = mvcrouter
