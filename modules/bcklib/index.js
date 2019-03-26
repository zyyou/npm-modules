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

//通用返回代码
exports.retCode = {
  unknown: -1,
  ok: 1,
  sysErr: 1000,
  paramErr: 1001
};

/**
 * 加载配置文件
 *
 * @param {String} fileName 配置文件名
 * @returns
 */
exports.loadConfig = (fileName) => {
  let cfg = require('./src/config');
  return cfg.load(fileName);
};

exports.log = require('./src/log');

exports.cutils = require('./src/client_utils.js');


/**
 * 获取调用模块名
 *
 * @returns
 */
function getParentName() {
  var name = '入口';
  if (module.parent) {
    name = module.id.replace(path.resolve(), '');
  }
  return name;
}






