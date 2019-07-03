const auth = require('auth-smtp');

module.exports = function (options) {
  const {
    host,
    port
  } = options;

  this.bindHook('third_login', async (ctx) => {
    let email = ctx.request.body.email;
    let password = ctx.request.body.password;

    let res = await auth.login(email, password, host, port);
    if (res.hasErr) {
      console.log('SMTP登录失败', email, res);
    } else {
      res = {
        email: email,
        username: email.split('@')[0]
      };
    }

    return res;
  })
}