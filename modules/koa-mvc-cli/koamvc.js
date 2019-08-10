#!/usr/bin/env node

const program = require('commander');
const init = require('./lib/init');

program
    .version(require('./package.json').version)
    .usage('<command>')
    .description('快速创建基于koa2的mvc工程');

program.command('init')
    .usage('<项目名称>')
    .description('初始化工程目录')
    .alias('i')
    .option('-d, --dev', '获取开发版工程模板')
    .action(function (name) {
        init(name, this.dev);
    });

program.parse(process.argv);

if (program.args.length == 0) {
    program.help();
}