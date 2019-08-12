'use strict';

const debug = require('debug')('koa-mvcrouter');
const compose = require('koa-compose');
const glob = require('glob');
const npath = require('path');
const nfs = require('fs');


/**
 * 设置响应header
 *
 * @param {*} res
 * @param {JSON} headers
 */
function setHeader(res, headers) {
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
function buildView(ctx, view, layout) {
    if (!view) {
        console.log('ctx', ctx, 'this', this);
        let pi = ctx._matchedRoute.indexOf(':');
        let path = pi == -1 ? ctx._matchedRoute : ctx._matchedRoute.substring(0, pi);
        let parr = path.split('/').filter((p) => {
            return p.length > 0
        });
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
    return {
        view: view,
        layout: layout
    };
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
async function viewAction(ctx, action, resHeaders, view, layout) {
    let data = await action(ctx);
    data = data || {};
    data.title = data.title || '';
    data.ctx = data.ctx || ctx;

    let viewData = buildView(ctx, data.view || view, data.layout || layout);
    data.layout = viewData.layout;

    resHeaders = resHeaders || {};
    resHeaders['Content-Type'] = resHeaders['Content-Type'] || 'text/html; charset=utf-8';
    setHeader(ctx.res, resHeaders);
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
async function reqAction(ctx, action, resHeaders, contentType) {
    let data = await action(ctx);
    //data = data || {};

    resHeaders = resHeaders || {};
    resHeaders['Content-Type'] = contentType;
    setHeader(ctx.res, resHeaders);
    ctx.body = data;
    debug('%s %s Content-Type=%s\r\n\tData=%j\r\n\tParams=%j\r\n\tQuery=%j', ctx.method, ctx.path, contentType, ctx.request.body, ctx.params, ctx.request.query);
};

/**
 *  当前路由
 */
var mRouter;

/**
 * 加载路由
 *
 * @returns
 */
exports.load = () => {
    var routers = [];
    let cPath = npath.join(process.cwd(), 'controllers');
    let indexFile = npath.join(cPath, 'index.js');

    //先注册index
    if (nfs.existsSync(indexFile)) {
        mRouter = require('koa-router')();
        require(indexFile);
        routers.push(mRouter.routes());
        routers.push(mRouter.allowedMethods());
        debug('注册首页路由：%s', indexFile);
    }

    let regex = new RegExp(`(${cPath})|(.js)`, 'gm');
    glob.sync(npath.resolve('controllers', '**', '*.js')).forEach(file => {
        let urlPath = file.replace(regex, '');
        if (urlPath == '/index') {
            return true;
        }

        mRouter = require('koa-router')();
        require(file);
        mRouter.prefix(urlPath);

        routers.push(mRouter.routes());
        routers.push(mRouter.allowedMethods());
        debug('注册路由：%s 文件：%s', urlPath, file);

    });

    //index单独处理，否则URL必须带controller路径，index建议只写一个没有前缀的action，否则容易跟其他controller冲突
    if (indexFile) {
        mRouter = require('koa-router')();
        require(indexFile);
        routers.push(mRouter.routes());
        routers.push(mRouter.allowedMethods());
    }

    return compose(routers);
};


/**
 *
 * 初始化控制器
 * @param {'koa-router'} router Koa-Router对象
 */
exports.init = function (router) {
    console.warn('koa-mvcrouter 1.X 已不需要调用init');
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
    mRouter.get(path, async (ctx, next) => {
        await viewAction(ctx, action, resHheaders, view, layout);
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
    mRouter.post(path, async (ctx, next) => {
        await viewAction(ctx, action, resHheaders, view, layout);
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
    mRouter.get(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
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
    mRouter.post(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
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
    mRouter.put(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
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
    mRouter.delete(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'application/json;charset=' + charset);
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
    mRouter.get(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'text/plain;charset=' + charset);
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
    mRouter.post(path, async (ctx, next) => {
        await reqAction(ctx, action, resHheaders, 'text/plain;charset=' + charset);
    });
};