'use strict';

const mvcrouter = require('../../modules/koa-mvcrouter')();

//index controller中建议只写此action
mvcrouter.jsonGET('/index', function (ctx) {
  return {
    title: 'test.ttt/'
  };
});


module.exports = mvcrouter
