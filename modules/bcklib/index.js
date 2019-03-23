'use strict';


/**
 * 构建公共消息对象
 *
 * @param {Boolean} hasErr 是否有错误 
 * @param {String} msg 要返回的消息
 * @param {JSON} data 要返回的数据
 * @param {Number} code 要返回的消息代码
 */
exports.retMsg = (hasErr, msg, data, code) => {
  hasErr = hasErr ? true : false;
  msg = msg || '未知';
  data = data || {};
  code = code || -1;
  return { hasErr: hasErr, message: msg, data: data, code: code };
};

exports.retCode = {
  unknown: -1,
  ok: 1,
  sysErr: 1000,
  paramErr: 1001
}



