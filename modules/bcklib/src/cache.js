'use strict';

const Redis = require("ioredis");
const stringUtils = require("./string_utils");

//读写
let client = null;

//只读
let clientRead = null;

/**
 * 检查服务是否可用
 *
 * @param {Boolean} isRead 检查只读库
 * @returns
 */
function redisIsOk(isRead) {
    if (isRead) {
        return clientRead && clientRead.status == 'ready';
    }
    return client && client.status == 'ready';
}

function buildOpts(opts) {
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
    return opts;
}

/**
 * 初始化
 *
 * @param {JSON} opts 读写库配置
 * @param {JSON} readOpts 只读库配置，不为空时所有读取使用该配置
 */
exports.init = async (opts, readOpts) => {
    opts = buildOpts(opts);
    client = new Redis(opts);
    client.on('error', function (error) {
        console.error('缓存服务[读写库]异常', error);
    });
    client.on('end', function () {
        console.warn('缓存服务[读写库]已断开');
    });
    client.on("ready", () => {
        console.log("缓存服务[读写库]准备就绪");
    });

    //初始化只读库
    if (readOpts) {
        readOpts = buildOpts(readOpts);
        clientRead = new Redis(readOpts);
        clientRead.on('error', function (error) {
            console.error('缓存服务[只读库]异常', error);
        });
        clientRead.on('end', function () {
            console.warn('缓存服务[只读库]已断开');
        });
        clientRead.on("ready", () => {
            console.log("缓存服务[只读库]准备就绪");
        });
    }
};

/**
 * 写缓存
 *
 * @param {String} key，将自动转换成string类型
 * @param {*} value 值，将自动转换成string类型
 * @returns
 */
exports.set = async (key, value) => {
    key = stringUtils.notNullStr(key);
    value = stringUtils.notNullStr(value);

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

/**
 * 读缓存
 *
 * @param {String} key
 * @returns
 */
exports.get = async (key) => {
    key = stringUtils.notNullStr(key);

    let res;
    let cli = null;
    if (redisIsOk(true)) {
        cli = clientRead;
    } else if (redisIsOk()) {
        cli = client;
    } else {
        return res;
    }

    try {
        res = stringUtils.notNullStr(await cli.get(key));
    } catch (e) {
        console.error('读取缓存异常', e);
    }
    return res;
};

