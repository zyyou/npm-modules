'use strict';

const debug = require('debug')('koa-mvcrouter');
const compose = require('koa-compose');
const glob = require('glob');
const npath = require('path');
const nfs = require('fs');

/**
 * 加载路由
 *
 * @returns
 */
exports.load = () => {
    var routers = [];
    var indexFile;
    glob.sync(npath.resolve('controllers', '**', '*.js')).forEach(file => {
        if (file.endsWith('index.js')) {
            indexFile = file;
        } else {
            routers.push(require(file).routes());
            routers.push(require(file).allowedMethods());
        }
    });

    //index单独处理，否则URL必须带controller路径，index建议只写一个没有前缀的action，否则容易跟其他controller冲突
    if (indexFile) {
        let index = require(indexFile);
        routers.push(index.routes());
        routers.push(index.allowedMethods());
    }

    return compose(routers);
};


/**
 *  当前路由
 */
exports.router = {};

/**
 *
 * 初始化控制器
 * @param {'koa-router'} router Koa-Router对象
 * @param {*} m 当前模块 moudle
 */
exports.init = function (router, m) {
    this.router = router;
    let cpath = m.filename.substring(m.filename.indexOf('/controllers/') + 12, m.filename.length - 3);
    //index路由不需要设置，否则/无法访问
    if (cpath != '/index') {
        this.router.prefix(cpath);
    }
    debug('注册路由：%s 文件：%s', cpath, m.filename);
};

/**
 * 设置响应header
 *
 * @param {*} res
 * @param {JSON} headers
 */
exports.setHeader = function (res, headers) {
    headers = headers || {};
    for (var key in headers) {
        res.setHeader(key, headers[key]);
    }
};

/**
 * 组织视图
 *
 * @param {*} res
 * @param {JSON} headers
 */
exports.buildView = function (ctx, view, layout) {
    if (!view) {
        let pi = ctx._matchedRoute.indexOf(':');
        let path = pi == -1 ? ctx._matchedRoute : ctx._matchedRoute.substring(0, pi);
        let parr = path.split('/').filter((p) => { return p.length > 0 });
        switch (parr.length) {
            case 0:
                parr.push('index', 'index');
                break;
            case 1:
                parr.push('index');
                break;
        }

        if (parr.length <= 1) {
            parr.push('index');
        }

        //view = npath.join(parr[0], parr[1]);
        view = parr.join('/');
    }

    if (layout) {
        layout = npath.join('_layout', layout);
    } else {
        //默认布局
        layout = npath.join('_layout', 'default');
    }

    //自适应手机视图
    if (ctx.userAgent.isMobile) {
        if (nfs.existsSync(npath.resolve('views', view + '.h5.ejs'))) {
            view += '.h5';
        }

        if (nfs.existsSync(npath.resolve('views', layout + '.h5.ejs'))) {
            layout += '.h5';
        }
    }
    return { view: view, layout: layout };
};

/**
 * 视图处理函数
 *
 * @param {*} ctx
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHeaders 响应头数据
 * @param {String} view 视图，为空自动匹配
 * @param {String} layout 布局，为空自动匹配
 */
exports.viewAction = async function (ctx, action, resHeaders, view, layout) {
    let data = await action(ctx);
    data = data || {};

    if (data.title) {
        data.title += ' - ' + ctx._appConfig.title;
    } else {
        data.title = ctx._appConfig.title;
    }

    let viewData = this.buildView(ctx, view, layout);
    data.layout = viewData.layout;

    resHeaders = resHeaders || {};
    resHeaders['Content-Type'] = resHeaders['Content-Type'] || 'text/html; charset=utf-8';
    this.setHeader(ctx.res, resHeaders);
    await ctx.render(viewData.view, data);
    debug('%s %s View=%j \r\n\tData=%j\r\n\tParams=%j\r\n\tQuery=%j', ctx.method, ctx.path, viewData, ctx.request.body, ctx.params, ctx.request.query);
};

/**
 * 非视图请求处理函数
 *
 * @param {*} ctx
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHeaders 响应头数据
 * @param {String} contentType
 */
exports.reqAction = async function (ctx, action, resHeaders, contentType) {
    let data = await action(ctx);
    data = data || {};
    resHeaders = resHeaders || {};
    resHeaders['Content-Type'] = contentType;
    this.setHeader(ctx.res, resHeaders);
    ctx.body = data;
    debug('%s %s Content-Type=%s\r\n\tData=%j\r\n\tParams=%j\r\n\tQuery=%j', ctx.method, ctx.path, contentType, ctx.request.body, ctx.params, ctx.request.query);
};


//---------------------------------------------------------------------

/**
 * GET 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} view 视图，为空自动匹配
 * @param {String} layout 布局，为空自动匹配
 */
exports.viewGET = function (path, action, resHheaders, view, layout) {
    this.router.get(path, async (ctx, next) => {
        await this.viewAction(ctx, action, resHheaders, view, layout);
    });
};

/**
 * POST 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} view 视图，为空自动匹配
 * @param {String} layout 布局，为空自动匹配
 */
exports.viewPOST = function (path, action, resHheaders, view, layout) {
    this.router.post(path, async (ctx, next) => {
        await this.viewAction(ctx, action, resHheaders, view, layout);
    });
};

/**
 * JSON GET 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.jsonGET = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.get(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
    });
};

/**
 * JSON POST 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.jsonPOST = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.post(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
    });
};

/**
 * RESTful PUT
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.jsonPUT = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.put(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
    });
};

/**
 * RESTful DELETE
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.jsonDELETE = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.delete(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
    });
};

/**
 * Text GET 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.textGET = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.get(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'text/plain;charset=' + charset);
    });
};

/**
 * Text POST 请求
 *
 * @param {String} path 访问路由 
 * @param {Function} action 处理函数，接收ctx，返回视图数据
 * @param {JSON} resHheaders 响应头数据
 * @param {String} charset 响应数据编码，默认utf-8
 */
exports.textPOST = function (path, action, resHheaders, charset) {
    charset = charset || 'utf-8';
    this.router.post(path, async (ctx, next) => {
        await this.reqAction(ctx, action, resHheaders, 'text/plain;charset=' + charset);
    });
};




/**
 * 返回当前路由，用于导出到模块 module.exports = getRouter();
 *
 * @returns
 */
exports.getRouter = function () {
    return this.router;
};

