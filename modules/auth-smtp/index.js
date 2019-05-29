'use strict';

const bcklib = require('bcklib');
const net = require('net');
var debug = require('debug')('auth-smtp');

/**
 * 初始化
 *
 * @param {String} email 邮件地址
 * @param {String} password 邮箱密码
 * @param {String} host SMTP服务地址
 * @param {String} port SMTP端口，默认25
 */
exports.login = async (email, password, host, port) => {
    port = port || 25;
    let command = ["HELO localhost", "AUTH LOGIN",
        Buffer.from(email).toString('base64'),
        Buffer.from(password).toString('base64'),
        "QUIT"].reverse();

    return new Promise((resolve, reject) => {
        let conn = net.connect(port, host);
        let resData = '';
        let authOk = false;

        conn.on("error", (data) => {
            console.error('smtp鉴权异常', data);
            conn.destroy();
            resolve(bcklib.retMsg(true, 'smtp鉴权异常', data));
        });

        conn.on("end", (data) => {
            debug('resdata:%s', resData);
            resolve(bcklib.retMsg(!authOk, authOk ? 'ok' : '登录失败', resData));
        });

        conn.on("data", async (data) => {
            data = data.toString();
            resData += data;
            if (command.length == 1 && data.startsWith('235 ')) {
                authOk = true;
            }
            const cmd = command.pop();
            if (cmd) {
                //console.log('cmd', cmd);
                await conn.write(cmd + "\r\n");
            }
        });
    });
};
