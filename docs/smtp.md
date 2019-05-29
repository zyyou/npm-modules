## 说明
SMTP的权限认证库，用于基于smtp邮箱实现登录功能

## 安装到工程
```shell
npm i auth-smtp -S
```

## 登录鉴权

```javascript
    const auth = require('auth-smtp');
    let res = await auth.login('email', 'password');
    //res.hasErr=false 时登录成功
    console.log('res', res);

```