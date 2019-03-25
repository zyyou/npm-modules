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
let res = await httpSync.get(url);
```