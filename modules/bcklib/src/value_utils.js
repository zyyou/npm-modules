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


