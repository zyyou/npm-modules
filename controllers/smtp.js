'use strict';
const mvcrouter = require('../modules/koa-mvcrouter')();
const auth = require('../modules/auth-smtp');


mvcrouter.textGET('/', async function (ctx) {
    let res = await auth.login('email', 'password');
    console.log('res', res);
    return 'ok';
});

module.exports = mvcrouter;
