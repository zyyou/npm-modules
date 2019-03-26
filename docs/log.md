## 说明
log4js扩展，自动记录写日志的模块所在文件

## init
在入口文件中初始化
- 函数调用示例
```javascript
bcklib.log.init(bcklib.loadConfig('logconf.js'))
```

- 入参
<table data-hy-role="doctbl">
    <tr>
        <th>Key</th>
        <th>类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>config</td>
        <td>json</td>
        <td>log4js配置文件</td>
    </tr>
</table>

- 配置文件示例 logconf.js
```javascript
module.exports = {
    replaceConsole: true,
    appenders: {
        console: {
            type: 'console'
        },
        file: {
            type: 'file',
            filename: 'logs/npmmodules.log',
            maxLogSize: 204800,
            backups: 1000
        },
        datefile: {
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'npmmodules_yyyyMMdd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: [
                'console'
            ],
            level: 'ALL'
        },
        datefile: {
            appenders: [
                'datefile'
            ],
            level: 'ALL'
        },
        file: {
            appenders: [
                'file'
            ],
            level: 'ALL'
        }
    }
}
```

## 写日志
- 函数调用示例

```javascript
bcklib.log.cDebug('ddddddd', 123, { a: 1 }); //控制台 debug 日志 
bcklib.log.cWarn('wwwwwww', 123, { a: 1 }); //控制台 warn 日志
bcklib.log.cError('eeeeeee', 123, { a: 1 }); //控制台 error 日志

bcklib.log.fDebug('ddddddd', 123, { a: 1 }); //文件 debug 日志 
bcklib.log.fWarn('wwwwwww', 123, { a: 1 }); //文件 warn 日志
bcklib.log.fError('eeeeeee', 123, { a: 1 }); //文件 error 日志
```
