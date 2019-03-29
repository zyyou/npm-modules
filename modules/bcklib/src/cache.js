'use strict';


const redis = require("redis");

const { retMsg } = require("../index.js");

var client = null;

exports.init = async (db, ip, port, pwd) => {
    let opt = {
        host: ip,
        port: port,
        db: db,
        password: pwd,
        socket_keepalive: true,
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                //console.error('缓存服务连接被拒');
            }
            if (options.attempt % 10 == 0) {
                console.error('连接缓存服务重试第', options.attempt, '次 ', options.total_retry_time / 1000, ' 秒');
            }
            //console.log('options:', options);
            //几毫秒后重连
            return options.attempt > 1000 ? null : 6 * 1000;
        }
    };

    client = await redis.createClient(opt);
    client.getSync = require('util').promisify(client.get).bind(client);

    client.on('error', function (error) {
        console.error('err', error);
    });
    client.on('end', function () {
        console.warn('缓存服务已断开');
    });
    // client.on("ready", () => {
    //     console.log("redis ready");
    // });
    client.on("connect", () => {
        console.log("redis connect");
        // if(client.password){
        //     client.auth(client.password);
        // }
    });

    if (!client.connected) {
        return retMsg(true, '缓存服务当前不可用', {});
    }

    return retMsg(false, 'ok');
};

exports.set = async (key, value) => {

    return await client.set(key, value);
};

exports.get = async (key) => {
    return await client.getSync(key);
};

