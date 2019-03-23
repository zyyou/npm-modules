'use strict';
//文件底部有配置参考，配置放到../config/logconf.json

var log4js = require("log4js");
const path = require('path')

/**
 * 日志工具log4js
 */
module.exports = function hylog(name) {
    if (!(this instanceof hylog)) {
        return new hylog(name);
    }
    log4js.configure(require(path.join(__dirname, '../config/logconf.json')));
    this.parentName = name;


    /**
     * 控制台 Debug 日志
     *
     * @param {*} args 日志内容
     */
    this.cDebug = (...args) => {
        args.unshift(this.parentName);
        let loger = log4js.getLogger('console');
        loger.debug.apply(loger, args);
    }

    /**
     * 控制台 Warn 日志
     *
     * @param {*} args 日志内容
     */
    this.cWarn = (...args) => {
        args.unshift(this.parentName);
        let loger = log4js.getLogger('console');
        loger.warn.apply(loger, args);
    }

    /**
     * 控制台 Error 日志
     *
     * @param {*} args 日志内容
     */
    this.cError = (...args) => {
        args.unshift(this.parentName);
        let loger = log4js.getLogger('console');
        loger.error.apply(loger, args);
    }

    /**
     * 文件 Debug 日志
     *
     * @param {*} args 日志内容
     */
    this.fDebug = (...args) => {
        this.cDebug(args);
        args.unshift(this.parentName);
        let loger = log4js.getLogger('datefile');
        loger.debug.apply(loger, args);
    }

    /**
     * 文件 Warn 日志
     *
     * @param {*} args 日志内容
     */
    this.fWarn = (...args) => {
        this.cWarn(args);
        args.unshift(this.parentName);
        let loger = log4js.getLogger('datefile');
        loger.warn.apply(loger, args);
    }

    /**
     * 文件 Error 日志
     *
     * @param {*} args 日志内容
     */
    this.fError = (...args) => {
        this.cError(args);
        args.unshift(this.parentName);
        let loger = log4js.getLogger('datefile');
        loger.error.apply(loger, args);
    }
}









/*
    logconf.json 配置参考
    {
    "replaceConsole": true,
    "appenders": {
        "console": {
            "type": "console"
        },
        "file": {
            "type": "file",
            "filename": "./logs/log_file/koatest.log",
            "maxLogSize": 204800,
            "backups": 1000
        },
        "datefile": {
            "type": "dateFile",
            "filename": "./logs/",
            "pattern": "koatest_yyyyMMdd.log",
            "alwaysIncludePattern": true
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "console"
            ],
            "level": "ALL"
        },
        "datefile": {
            "appenders": [
                "datefile"
            ],
            "level": "ALL"
        },
        "file": {
            "appenders": [
                "file"
            ],
            "level": "ALL"
        }
    }
}

*/


