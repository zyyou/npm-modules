## 说明
- nodejs http、https 同步请求
- 通过请求地址自动识别http或者https
- 支持 GET、POST、PUT、DELETE

## 安装到工程
```shell
npm i https-sync -S
```

## 引用
```javascript
const httpSync = require('https-sync');
```

## 调用
```javascript
//timeout默认10秒
let res = await httpSync.get(url,timeout);
res = await httpSync.postJSON(url, data, reqHeaders, timeout);
res = await httpSync.putJSON(url, data, reqHeaders, timeout);
res = await httpSync.deleteJSON(url, data, reqHeaders, timeout);
res = await httpSync.request(opts, data);
```