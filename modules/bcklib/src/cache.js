'use strict';

const Redis = require("ioredis");
const valueUtils = require("./value_utils");

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

/**
 * 优先返回只读库，都不可用返回null
 *
 * @returns
 */
function getReadClient() {
    if (redisIsOk(true)) {
        return clientRead;
    } else if (redisIsOk()) {
        return client;
    } else {
        return null;
    }
}

function buildOpts(opts, name) {
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
            console.warn(name, '缓存服务重试第', times, '次，', delay / 1000, '秒后重试');
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
    opts = buildOpts(opts, '读写');
    client = new Redis(opts);
    client.on('error', function (error) {
        console.error('缓存服务[读写]异常', error);
    });
    client.on('end', function () {
        console.warn('缓存服务[读写]已断开');
    });
    client.on("ready", () => {
        console.log("缓存服务[读写]准备就绪");
    });

    //初始化只读库
    if (readOpts) {
        readOpts = buildOpts(readOpts, '只读');
        clientRead = new Redis(readOpts);
        clientRead.on('error', function (error) {
            console.error('缓存服务[只读]异常', error);
        });
        clientRead.on('end', function () {
            console.warn('缓存服务[只读]已断开');
        });
        clientRead.on("ready", () => {
            console.log("缓存服务[只读]准备就绪");
        });
    }
};

/**
 * 写缓存
 *
 * @param {String} key，将自动转换成string类型
 * @param {*} value 值，将自动转换成string类型
 * @param {Number} second 有效期秒数，非数字或小于1不限制
 * @returns
 */
exports.set = async (key, value, second) => {
    key = valueUtils.notNullStr(key);
    value = valueUtils.notNullStr(value);
    second = parseInt(second);

    let res = undefined;
    if (!redisIsOk()) {
        return res;
    }

    try {
        if (isNaN(second) || second < 1) {
            res = await client.set(key, value);
        } else {
            res = await client.setex(key, second, value);
        }
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
    key = valueUtils.notNullStr(key);

    let cli = getReadClient();
    if (cli == null) {
        console.warn('缓存服务不可用，本次请求返回\'\'，key=', key);
        return '';
    }

    try {
        return valueUtils.notNullStr(await cli.get(key));
    } catch (e) {
        console.error('读取缓存异常，本次请求返回\'\'，key=', key, 'e=', e);
        return '';
    }
};

/**
 * 自增计数，不存在则创建+1，存在时值必须为数字
 *
 * @param {String} key
 * @returns
 */
exports.incr = async (key) => {
    key = valueUtils.notNullStr(key);

    let res = undefined;
    if (!redisIsOk()) {
        return res;
    }

    try {
        res = await client.incr(key);
    } catch (e) {
        console.error('写入缓存异常', e);
    }
    return res;
};

/**
 * 是否存在key，存在返回1，不存在返回0
 *
 * @param {String} key
 * @returns
 */
exports.exists = async (key) => {
    key = valueUtils.notNullStr(key);

    let res = undefined;
    let cli = getReadClient();
    if (cli == null) {
        return res;
    }

    try {
        res = valueUtils.notNullStr(await cli.exists(key));
    } catch (e) {
        console.error('读取缓存异常', e);
    }
    return res;
};

