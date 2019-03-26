'use strict';
const path = require('path');

/**
 * 获取客户端IP
 *
 * @param {String} fileName 配置文件名|默认在/_config目录下
 * @returns
 */
exports.load = (fileName) => {
    if (!fileName || fileName.length == 0) {
        fileName = 'appconfig.js';
    }

    let configPath = process.env.config_path;
    if (!configPath || configPath.length == 0) {
        configPath = 'config';
    }

    fileName = path.resolve(configPath, fileName);

    return require(fileName);
};

