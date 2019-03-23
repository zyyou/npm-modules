
/**
 * 自动刷新 jwt token
 * request header中 token-refresh=true 时刷新
 * 刷新后在 response header auth_token 中
 * 
 */


const debug = require('debug')('jwt-refresh');

const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');


module.exports = async (ctx, next) => {
    await next();

    var token = ctx.headers['authorization'];
    if (token) {
        if (ctx.headers['token-refresh']) {
            let user = ctx.state.user;
            delete user.iat;
            delete user.exp;

            token = jwt.sign(user, ctx._appConfig.tokenKey, { expiresIn: ctx._appConfig.tokenExpires });

            debug('延长 %s 新token %s', ctx._appConfig.tokenExpires, token);
        }
        ctx.res.setHeader('auth_token', token);
    }
}