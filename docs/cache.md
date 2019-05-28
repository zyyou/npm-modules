## 说明
nodejs 基于 ioredis 封装的缓存库

## 安装到工程
```shell
npm i cache-ioredis -S
```

## 初始化
应用启动时初始化，一般为app.js中

```javascript
const cache = require('cache-ioredis');

//在app.js中，options参照：https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
cache.init(options, readonlyOptions);

//示例(readonlyOptions可为空，为空时不启用读写分离)：
cache.init({ db: 0, host: 'Redis服务器IP', port: 'Redis端口号', password: '密码' });
```

## 初始化的options默认值

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

## 读写缓存

```javascript
  let res;
  //是否存在key，存在返回1，不存在0
  res = await bcklib.cache.exists('bcktest');
  console.log('exists:', res);
  //设置成功返回OK
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