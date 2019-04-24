'use strict';

var debug = require('debug')('https-sync');
const nurl = require('url');
const queryString = require('querystring');
const bcklib = require('bcklib');

/**
 * 发起请求，自识别http或https
 *
 * @param {URL} opts URL对象.
 * @param {JSON} data
 * @returns
 */
function request(opts, data) {
  opts.headers = opts.headers || {};
  //opts.headers.httpsync = true;
  opts.timeout = opts.timeout || 10 * 1000;

  if (data) {
    data = opts.isJson ? JSON.stringify(data) : queryString.stringify(data);
    opts.headers['Content-Length'] = Buffer.byteLength(data);
  }
  debug('request opts=%j \t\t param=%s', opts, data);

  let http = opts.protocol == 'https:' ? require('https') : require('http');
  return new Promise((resolve, reject) => {
    let req = http.request(opts, (res) => {
      if (res.statusCode != 200) {
        reject(bcklib.retMsg(true, '请求异常 ' + res.statusMessage, {}, res.statusCode));
      }
      let resData = '', resStr = '';
      res.on('data', (dt) => {
        resStr += dt;
      });
      res.on('end', () => {
        resData = resStr.startsWith('{') ? JSON.parse(resStr) : resStr;

        debug('request res=%s', resStr);

        resolve(bcklib.retMsg(false, 'ok', resData, bcklib.retCode.ok));
      });
    });
    req.on(('error'), (e) => {
      debug('请求异常 %s %j %j', e.message, opts, e);
      reject(bcklib.retMsg(true, '请求异常 ' + e.message, {}, bcklib.retCode.sysErr));
    });
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

/**
 * 发送GET请求
 *
 * @param {String} url
 * @param {JSON} reqHeaders 请求头信息
 * @returns
 */
exports.get = function (url, reqHeaders) {
  let opts = nurl.parse(url);
  opts.method = 'GET';
  opts.headers = reqHeaders || {};
  return request(opts);
}

/**
 * 发送POST JSON 请求
 *
 * @param {String} url
 * @param {JSON} data
 * @param {JSON} reqHeaders 请求头信息
 * @returns
 */
exports.postJSON = function (url, data, reqHeaders) {
  let opts = nurl.parse(url);
  opts.method = 'POST';
  opts.isJson = true;
  opts.headers = reqHeaders || {};
  opts.headers['Content-Type'] = 'application/json';
  return request(opts, data);
}

/**
 * 发送PUT JSON 请求
 *
 * @param {String} url
 * @param {JSON} data
 * @param {JSON} reqHeaders 请求头信息
 * @returns
 */
exports.putJSON = function (url, data, reqHeaders) {
  let opts = nurl.parse(url);
  opts.method = 'PUT';
  opts.isJson = true;
  opts.headers = reqHeaders || {};
  opts.headers['Content-Type'] = 'application/json';
  return request(opts, data);
}

/**
 * 发送PUT JSON 请求
 *
 * @param {String} url
 * @param {JSON} data
 * @param {JSON} reqHeaders 请求头信息
 * @returns
 */
exports.deleteJSON = function (url, data, reqHeaders) {
  let opts = nurl.parse(url);
  opts.method = 'DELETE';
  opts.isJson = true;
  opts.headers = reqHeaders || {};
  opts.headers['Content-Type'] = 'application/json';
  return request(opts, data);
}

