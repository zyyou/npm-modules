## 取客户端IP getClientIP
获取客户端IP，兼容代理
- 函数调用
```javascript
bcklib.cutils.getClientIP()
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>req</td>
        <td>json</td>
        <td>koa ctx.req</td>
    </tr>
</table>

- 出参
string类型IP