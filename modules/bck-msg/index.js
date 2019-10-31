'use strict';
const validator = require('validator');
// const util = require('util');

/**
 * 开放平台消息
 *
 * @param {Number} code  接口调用状态码(SUCCESS等)
 * @param {String} message   接口调用状态码描述（ok等）
 * @param {JSON} data
 * @param {String} devMsg   开发者消息，禁止对外显示
 * @param {Function} signFun    消息签名函数
 * @returns
 */
exports.openAPIMsg = (code, message, data, devMsg, signFun) => {
  if (data && 'object' === typeof data) {
    data = JSON.stringify(data);
  }

  if ('string' == typeof data && validator.isJSON(data)) {
    data = JSON.parse(data);
  } else {
    data = { data };
  }
  data.return_code = code;
  data.return_msg = message;
  data.error = data.return_code !== 'SUCCESS';
  if (devMsg !== undefined) {
    data.dev_msg = devMsg;
  }

  if ('function' == typeof signFun) {
    data.sign = signFun(data);
  }

  return data;
};

/**
 * 开放平台处理成功消息
 *
 * @param {String} message   接口调用状态码描述（ok等）
 * @param {JSON} data
 * @param {Function} signFun    消息签名函数
 * @returns
 */
exports.openAPISuccess = (message, data, signFun) => {
  return this.openAPIMsg('SUCCESS', message, data, signFun);
};

/**
 * 开放平台处理失败消息
 *
 * @param {String} message   接口调用状态码描述（ok等）
 * @param {JSON} data
 * @param {Function} signFun    消息签名函数
 * @returns
 */
exports.openAPIFail = (message, data, signFun) => {
  return this.openAPIMsg('FAIL', message, data, signFun);
};

/**
 * 函数返回消息
 *
 * @param {Boolean} error 是否有错误
 * @param {String} message
 * @param {JSON} data
 * @param {String} code
 * @param {String} devMsg 开发者消息，禁止对外显示
 * @returns
 */
exports.retMsg = (error, message, data, code, devMsg) => {
  if (error !== true && error !== false) {
    console.error('regMsg error为布尔型');
    return {};
  }
  return {
    error,
    message,
    data,
    code,
    dev_msg: devMsg,
  };
};

/**
 * 通过消息对象构造开放平台消息
 *
 * @param {JSON} retMsg 成功时code无效{ error, message, data, code }
 * @param {Function} signFun    消息签名函数
 * @returns
 */
exports.makeOpenAPIMsg = (retMsg, signFun) => {
  if (retMsg.error !== true && retMsg.error !== false) {
    console.error('makeOpenAPIMsg 消息格式必须为：{ error, message, data, code }');
    return {};
  }
  let retCode, message;
  if (retMsg.error) {
    retCode = retMsg.code || 'FAIL';
    message = retMsg.message || 'unknown';
  } else {
    retCode = 'SUCCESS';
    message = 'ok';
  }
  return this.openAPIMsg(retCode, message, retMsg.data, retMsg.devMsg, signFun);
};
