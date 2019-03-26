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
        <td>json</td>
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

## loadConfig
根据环境变量加载配置文件，可应用于开发生产配置分离以及自动化部署等场景
- 函数调用
```javascript
bcklib.loadConfig()
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
        <td>配置文件文件名，注意不需要目录，默认值：appconfig.js</td>
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
      config_path:'/Users/zyy/config' //支持 ./ 或 / ，分别表示当前工程根目录和系统根目录
    }
```

- 示例配置文件：appconfig.js
```javascript
module.exports = {
    port: 3002,
    title: 'npm模块开发',
    author: 'zyy'
}
```

!>注意
