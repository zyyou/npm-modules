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
function buildView(router, ctx, view, layout) {
    if (!view) {
        let pi = ctx._matchedRoute.indexOf(':');
        let path = pi == -1 ? ctx._matchedRoute : ctx._matchedRoute.substring(0, pi);

        let controller = router.opts.prefix || '/index';
        let action = path.replace(controller, '');
        if (action == '/') {
            action = '/index';
        }
        view = controller.substring(1) + action
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
async function viewAction(router, ctx, action, resHeaders, view, layout) {

    //console.log('router', router);

    let data = await action(ctx);
    data = data || {};
    data.title = data.title || '';
    data.ctx = data.ctx || ctx;

    let viewData = buildView(router, ctx, data.view || view, data.layout || layout);
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
 * 输出函数
 */
function mvcRouter() {
    let koaRouter = require('koa-router')();

    this.getRouter = () => {
        return koaRouter;
    }

    /**
     * 加载路由
     *
     * @returns
     */
    this.load = (app) => {
        var routers = [];
        let cPath = npath.join(process.cwd(), 'controllers');
        let indexFile = npath.join(cPath, 'index.js');

        //先注册index
        if (nfs.existsSync(indexFile)) {
            //console.log('mvcr', mvcr);
            let router = require(indexFile).getRouter();
            app.use(router.routes(), router.allowedMethods());
            debug('注册首页路由：%s', indexFile);
        }

        let regex = new RegExp(`(${cPath})|(.js)`, 'gm');
        glob.sync(npath.resolve('controllers', '**', '*.js')).forEach(file => {
            let urlPath = file.replace(regex, '');
            if (urlPath == '/index') {
                return true;
            }
            let router = require(file).getRouter();
            router.prefix(urlPath);
            app.use(router.routes(), router.allowedMethods());
            debug('注册路由【%s】：%s', urlPath, file);
        });
        return compose(routers);
    };

    /**
     * GET 请求
     *
     * @param {String} path 访问路由 
     * @param {Function} action 处理函数，接收ctx，返回视图数据
     * @param {JSON} resHheaders 响应头数据
     * @param {String} view 视图，为空自动匹配
     * @param {String} layout 布局，为空自动匹配
     */
    this.viewGET = (path, action, resHheaders, view, layout) => {
        //console.log('kkkkk',koaRouter);
        koaRouter.get(path, async (ctx, next) => {
            await viewAction(koaRouter, ctx, action, resHheaders, view, layout);
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
    this.viewPOST = (path, action, resHheaders, view, layout) => {
        koaRouter.post(path, async (ctx, next) => {
            await viewAction(koaRouter, ctx, action, resHheaders, view, layout);
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
    this.jsonGET = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.get(path, async (ctx, next) => {
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
    this.jsonPOST = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.post(path, async (ctx, next) => {
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
    this.jsonPUT = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.put(path, async (ctx, next) => {
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
    this.jsonDELETE = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.delete(path, async (ctx, next) => {
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
    this.textGET = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.get(path, async (ctx, next) => {
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
    this.textPOST = (path, action, resHheaders, charset) => {
        charset = charset || 'utf-8';
        koaRouter.post(path, async (ctx, next) => {
            await reqAction(ctx, action, resHheaders, 'text/plain;charset=' + charset);
        });
    };
}

//module.exports = new mvcRouter();
module.exports = () => {
    return new mvcRouter();
};