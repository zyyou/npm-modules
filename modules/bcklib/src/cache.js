'use strict';

const Redis = require("ioredis");

let client = null;

function redisIsOk() {
    return client && client.status == 'ready';
}

exports.init = async (opts) => {
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

    client = new Redis(opts);

    client.on('error', function (error) {
        console.error('缓存服务异常', error);
    });
    client.on('end', function () {
        console.warn('缓存服务已断开');
    });
    client.on("ready", () => {
        console.log("缓存服务准备就绪");
    });
};

exports.set = async (key, value) => {
    let res = 'err';
    if (!redisIsOk()) {
        return res;
    }
    try {
        res = await client.set(key, value);
    } catch (e) {
        console.error('写入缓存异常', e);
    }
    return res;
};

exports.get = async (key) => {
    let res;
    if (!redisIsOk()) {
        return res;
    }

    try {
        res = await client.get(key);
    } catch (e) {
        console.error('读取缓存异常', e);
    }
    return res;
};

