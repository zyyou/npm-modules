# yapi-plugin-smtp 

# 使用
```shell
# 进入yapi工程目录执行
yapi plugin --name yapi-plugin-smtp 
```

# SMTP登录插件，配置方法如下：   

第一步： 在生成的配置文件config.json中加入如下配置：  

```javascript
"plugins": [
  {
    "name": "smtp",
    "options": {
      "host": "mail.***.com",
      "port": 25
    }
  }
]
```

这里面的配置项含义如下：  

- `host` SMTP服务器 
- `port` SMTP服务器端口


第二步：在config.json目录下执行以下命令安装

```
yapi plugin --name yapi-plugin-smtp
```   

第三步： 重启服务器

# 其他资料
- 文档 https://bcklib.js.org
- QQ群：13924029