const util = require('util');
const Koa = require('koa');
const app = new Koa();
const render = require('koa-ejs');
const path = require('path');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const userAgent = require('koa-useragent');
const escapeHtml = require('escape-html');


const bcklib = require('./modules/bcklib');
const mvcrouter = require('./modules/koa-mvcrouter')();
const cache = require('./modules/cache-ioredis');
const appConfig = bcklib.config.load();

// 全局异常捕获
app.on('error', (err, ctx) => {
  console.error('server error', err);
  //hylog.fError('server error\r\n\terr:' + JSON.stringify(err) + '\r\n\tctx:' + JSON.stringify(ctx));
});

// error handler
onerror(app, {
  all: (err, ctx) => {
    switch (ctx.accepts('json', 'html')) {
      case 'json':
        console.log('json  err');
        ctx.body = JSON.stringify(bcklib.message(true, err.message, {}, err.status));
        break;
      default:
        console.log('html  err');
        let template = path.join(__dirname, 'views', 'error.html');
        template = require('fs').readFileSync(template, 'utf8');
        let body = template.replace('{{status}}', escapeHtml(err.status))
          .replace('{{stack}}', escapeHtml(err.stack))
          .replace('{{message}}', escapeHtml(err.message));
        ctx.body = body;
        ctx.type = 'html';
        break;
    }
  }
});

//缓存初始化
//cache.init(appConfig.redis);

//布局及视图配置
render(app, {
  //必须设置root目录，否则报错
  root: path.join(__dirname, '/views'),
  viewExt: 'ejs',
  cache: false,
  //debug: true
});

app.use(async (ctx, next) => {
  ctx._appConfig = appConfig;
  await next();
});

//koa中间件
//用于输出控制台KOA请求日志，生产环境可注释掉
app.use(logger());
app.use(userAgent);
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
//指定静态文件目录，否则不能静态访问
//app.use(require('koa-static')(__dirname + '/docs'));
app.use(require('koa-static')(__dirname + '/public'));

// 注册路由
mvcrouter.load(app);

module.exports = app;
