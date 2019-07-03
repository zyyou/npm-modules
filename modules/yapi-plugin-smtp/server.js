const auth = require('auth-smtp');

module.exports = function (options) {
  const {
    host,
    port
  } = options;

  this.bindHook('third_login', async (ctx) => {
    let email = ctx.request.body.email;
    let password = ctx.request.body.password;

    console.log('server', email, password, host, port);
    let res = await auth.login(email, password, host, port);
    if (!res.hasErr) {
      res = {
        email: email,
        username: email.split('@')[0]
      };
    }

    return res;
  })
}