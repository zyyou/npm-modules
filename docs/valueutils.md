## 说明
字符串通用库

## notNullStr
获取客户端IP，兼容代理
- 函数调用
```javascript
bcklib.valueUtils.notNullStr(new Date());
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>value</td>
        <td>*</td>
        <td>需要转换的数据</td>
    </tr>
</table>

- 出参
```text
string类型的值，不能转换的全部返回''
```

## subStrRight
从字符串右侧截取指定长度字符

- 函数调用
```javascript
bcklib.valueUtils.subStrRight('abc123ddd', 4);
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>str</td>
        <td>string</td>
        <td>源字符串</td>
    </tr>
    <tr>
        <td>length</td>
        <td>int</td>
        <td>右侧截取长度</td>
    </tr>
</table>

- 出参
```text
不足指定长度则原样返回，不是string返回''
```


