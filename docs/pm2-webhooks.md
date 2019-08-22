## 说明
- 监控当前服务器进程
- 通过配置筛选哪些进程需要发送什么事件或日志
- 支持 企业微信、钉钉

## 安装与更新

```shell
pm2 install pm2-webhooks
```

# 工程环境变量配置
在需要发送通知的工程环境变量中配置以下参数

```      
webhook_log_out: true,
webhook_log_error: true,
webhook_log_kill: true,
webhook_process_exception: true,
webhook_process_event: true,
webhook_process_msg: true,
webhook_mobiles: '需要@的手机号1,手机号2,手机号N',
webhook_url: 'webhook地址',
webhook_type: 'dingtalk'    //或者weixin
```
