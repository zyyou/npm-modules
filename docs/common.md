## 说明
公共库

## 通用响应对象retMsg
函数、接口间调用通用协议对象
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

- 出参
将入参序列化为json对象，示例：
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