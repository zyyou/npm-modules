'use strict';

const util = require('util');

/**
 * 返回非null字符串，可能会是''
 *
 * @param {*} value
 * @returns
 */
exports.notNullStr = (value) => {
    switch (typeof value) {
        case 'object':
        case 'json':
            return value === null ? '' : util.inspect(value);
        case 'boolean':
        case 'number':
            return value.toString();
        case 'string':
            return value;
        default:
            return '';
    }
};
/**
 * 从字符串右侧截取指定长度字符，不足指定长度则原样返回，不是string返回''
 *
 * @param {*} str 源
 * @param {*} length 长度
 * @returns
 */
exports.subStrRight = (str, length) => {
    if ('string' != typeof (str) || length <= 0) {
        return '';
    }

    if (str.length <= length) {
        return str;
    }

    return str.substring(str.length - length);
}


