'use strict';



/**
 * 获取客户端IP
 *
 * @param {*} req
 * @returns
 */
exports.getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

