'use strict';
const path = require('path');
const os = require('os');
const valueUtils = require('./value_utils');

/**
 * 获取客户端IP
 *
 * @param {String} fileName 配置文件名|默认在/_config目录下，环境变量优先：process.env.config_path
 * @param {Boolean} isCommon 是否公共配置，公共配置环境变量：process.env.config_path_common
 * @returns
 */
exports.load = (fileName, isCommon) => {
    if (!fileName || fileName.length == 0) {
        fileName = process.env.app_config || process.env.npm_package_name + '.js' || 'appconfig.js';
    }

    let configPath = isCommon ? process.env.config_path_common : process.env.config_path;
    if (valueUtils.notNullStr(configPath).length == 0) {
        configPath = 'config';
        if (isCommon) {
            configPath = path.join(configPath, 'common');
        }
    } else if (configPath.startsWith('~')) {
        configPath = os.homedir() + configPath.substring(1);
    }

    fileName = path.resolve(configPath, fileName);

    console.log(`加载配置文件 isCommon=${isCommon}`, fileName);

    return require(fileName);
};

