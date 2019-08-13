'use strict';

/**
 * 构建公共消息对象
 *
 * @param {Boolean} error 是否有错误 
 * @param {String} msg 要返回的消息
 * @param {*} data 要返回的数据
 * @param {String} code 要返回的消息代码
 */
exports.retMsg = (error, msg, data, code) => {
  error = error ? true : false;
  msg = msg || (error ? '未知' : 'ok');
  //data = data || {};
  code = code || '';
  return {
    error: error,
    message: msg,
    data: data,
    code: code
  };
};

//通用返回代码
exports.retCode = {
  unknown: -1,
  ok: 1,
  sysErr: 1000,
  paramErr: 1001
};


//exports.log = require('./src/log');

exports.cutils = require('./src/client_utils');
exports.valueUtils = require('./src/value_utils');

exports.config = require('./src/config');

//------------ 以下为过期
exports.sutils = this.valueUtils;

/**
 * 加载配置文件
 *
 * @param {String} fileName 配置文件名|默认在/_config目录下，环境变量优先：process.env.config_path
 * @returns
 */
exports.loadConfig = this.config.load;