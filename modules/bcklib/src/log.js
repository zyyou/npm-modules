'use strict';
//文件底部有配置参考

const log4js = require("log4js");
const path = require('path');

const cLoger = log4js.getLogger('console');
const dfLoger = log4js.getLogger('datefile');

exports.init = (config) => {
    log4js.configure(config);
};

exports.cDebug = (...args) => {
    args.unshift(getParentName());
    cLoger.debug.apply(cLoger, args);
};
exports.cWarn = (...args) => {
    args.unshift(getParentName());
    cLoger.warn.apply(cLoger, args);
};
exports.cError = (...args) => {
    args.unshift(getParentName());
    cLoger.error.apply(cLoger, args);
};

exports.fDebug = (...args) => {
    args.unshift(getParentName());
    dfLoger.debug.apply(dfLoger, args);
};
exports.fWarn = (...args) => {
    args.unshift(getParentName());
    dfLoger.warn.apply(dfLoger, args);
};
exports.fError = (...args) => {
    args.unshift(getParentName());
    dfLoger.error.apply(dfLoger, args);
};



/**
 * 获取调用模块名
 *
 * @returns
 */
function getParentName() {
    var name = '入口';
    //bcklib调用，所以需要得到bcklib的上级
    if (module.parent.parent) {
        name = module.id.replace(path.resolve(), '');
    }
    return name;
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


