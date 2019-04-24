## 说明
公共库

## retMsg
通用响应对象，函数、接口间调用通用协议对象
- 函数调用
```javascript
bcklib.retMsg()
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>hasErr</td>
        <td>bool</td>
        <td>是否错误响应</td>
    </tr>
    <tr>
        <td>msg</td>
        <td>string</td>
        <td>响应消息</td>
    </tr>
    <tr>
        <td>data</td>
        <td>*</td>
        <td>响应数据</td>
    </tr>
    <tr>
        <td>code</td>
        <td>int</td>
        <td>响应代码</td>
    </tr>
</table>

- 出参，将入参序列化为json对象，示例：
```javascript
{
  "hasErr": false,
  "message": "ok",
  "data": {
    "title": "json test",
    "reqData": {
      "val1": 123,
      "val2": "abc"
    }
  },
  "code": 1
}
```

## config
通过环境变量指定配置文件目录（变量名：process.env.config_path），环境变量未配置时默认工程根目录下的/config，可应用于开发生产配置分离以及自动化部署等场景
- 函数调用
```javascript
bcklib.config.load()
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>fileName</td>
        <td>string</td>
        <td>配置文件文件名，默认值：process.env.app_config || process.env.npm_package_name + '.js' || 'appconfig.js'</td>
    </tr>
    <tr>
        <td>isCommon</td>
        <td>boolean</td>
        <td>是否公共配置，为true时通过环境变量指定的目录读取配置，变量名：process.env.config_path_common</td>
    </tr>
</table>

- 出参，配置文件json对象，示例：
```javascript
{
  "port": 3002,
  "title": "npm模块开发",
  "author": "zyy"
}
```

- 环境变量配置
```javascript
env: {
      NODE_ENV: 'production',
      config_path:'/Users/zyy/config', //支持 ./ 或 / ，分别表示当前工程根目录和系统根目录
      config_path_common:'/Users/zyy/config'
    },
env_development: {
      NODE_ENV: 'development',
      config_path_common:'/Users/zyy/config'
    },
```

- 示例配置文件：appconfig.js
```javascript
module.exports = {
    port: 3002,
    title: 'npm模块开发',
    author: 'zyy'
}
```
!> 注意：如果环境变量中没有配置config_path，则默认工程目录的config文件夹

## cache
利用Redis实现的缓存

- 初始化

```javascript
//在app.js中，options参照：https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
bcklib.cache.init(options, readonlyOptions);

//示例(readonlyOptions可为空，为空时不启用读写分离)：
bcklib.cache.init({ db: 0, host: 'Redis服务器IP', port: 'Redis端口号', password: '密码' });
```

- options默认值

```javascript
opts = opts || {};
opts.connectTimeout = opts.connectTimeout || 10000;   //初始连接超时毫秒
opts.stringNumbers = opts.stringNumbers || true;  //强制数字以字符串返回，解决大数字溢出
opts.maxRetriesPerRequest = opts.maxRetriesPerRequest || 1;   //读写失败重试次数
opts.enableOfflineQueue = opts.enableOfflineQueue || false;   //禁用离线队列
//重连策略
if (!opts.retryStrategy) {
    opts.retryStrategy = (times) => {
        if (times > 100) {
            return null;
        }
        let delay = Math.min(times * 1000, 5000);
        console.warn('缓存服务重试第', times, '次，', delay / 1000, '秒后重试');
        return delay;
    }
}
```

- 读写缓存

```javascript
  let res;
  //是否存在key，存在返回1，不存在0
  res = await bcklib.cache.exists('bcktest');
  console.log('exists:', res);
  //设置成功返回OK
  //res = await bcklib.cache.set('bcktest', '123123aaaaaa ' + moment().format('YYYY-MM-DD HH:mm:ss'));
  res = await bcklib.cache.set('bcktest', '123123aaaaaa ' + moment().format('YYYY-MM-DD HH:mm:ss'), 20);
  console.log('set:', res);
  //返回值字符串
  res = await bcklib.cache.get('bcktest');
  console.log('get:', res);
  //计数
  res = await bcklib.cache.incr('testincr');
  console.log('incr:', res);
  //返回计数值
  res = await bcklib.cache.get('testincr');
  console.log('get incr:', res);
  

```