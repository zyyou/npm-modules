'use strict';

const chalk = require('chalk');
const download = require('download-git-repo');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const logSymbols = require('log-symbols');

module.exports = (name, isdev) => {
    if ('string' != typeof name) {
        console.log(logSymbols.error, '必须提供工程名称，-h 查看帮助');
        return;
    }

    let projectPath = path.join(process.cwd(), name);
    if (fs.existsSync(projectPath)) {
        console.log(logSymbols.error, '已存在同名目录，请调整后重试');
        return;
    }

    downloadTemplates(projectPath, name, isdev);
}

/**
 * 下载模板
 *
 * @param {*} projectPath 工程目录
 * @param {*} name 工程名
 * @param {*} isdev 是否以开发版模板构建
 */
function downloadTemplates(projectPath, name, isdev) {
    let repo, msg;
    if (isdev) {
        repo = 'dev';
        msg = '开始以 *开发* 模板构建工程...';
    } else {
        repo = 'master';
        msg = '开始构建工程...';
    }
    repo = `github:zyyou/koa-mvc#${repo}`;
    let spanner = ora(msg);
    spanner.start();

    let tempName = new Date().getTime();
    if (fs.existsSync(tempName)) {
        fs.rmdirSync(tempName);
    }
    let tempPath = __dirname + tempName;
    download(repo, tempPath, function (err) {
        console.log();
        if (err) {
            spanner.stop();
            console.log(chalk.red(logSymbols.error, '构建失败'), err);
            process.exit(0);
        }
        console.log(logSymbols.success, '模板下载完成');
        fs.renameSync(tempPath, projectPath);

        console.log(logSymbols.success, '完成工程创建，开始初始化...');
        initFile(projectPath, name);

        console.log(chalk.green(logSymbols.success, name, '构建成功'));
        spanner.stop();
        process.exit(0);
    });

}

function initFile(projectPath, name) {
    let filePath = path.join(projectPath, 'package.json');
    let data = require(filePath);
    data.name = name;
    data.scripts.dev = `pm2 start ecosystem.config.js --only ${name}-dev && pm2 log ${name}-dev`;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log(chalk.yellow(logSymbols.warning, 'package.json 初始化失败，请自行编辑'), err);
        }
    });
    console.log(logSymbols.success, 'package.json 初始化完成');

    //初始化appconfig.js
    let regex = new RegExp('koamvc', 'gm');
    let file = path.join(projectPath, 'config', 'appconfig.js')
    let content = fs.readFileSync(file);
    content = content.toString();
    content = content.replace(regex, name);
    fs.writeFileSync(file, content, function (err) {
        if (err) {
            console.log(chalk.yellow(logSymbols.warning, 'appconfig.js 初始化失败，请自行编辑'), err);
        }
    });
    console.log(logSymbols.success, 'appconfig.js 初始化完成');

    //重命名配置文件
    fs.renameSync(path.join(projectPath, 'config', 'koamvc.js'), path.join(projectPath, 'config', name + '.js'));
    console.log(logSymbols.success, name + '.js 初始化完成');

    //初始化pm2配置
    file = path.join(projectPath, 'ecosystem.config.js')
    content = fs.readFileSync(file);
    content = content.toString();
    content = content.replace(regex, name);
    fs.writeFileSync(file, content, function (err) {
        if (err) {
            console.log(chalk.yellow(logSymbols.warning, 'ecosystem.config.js 初始化失败，请自行编辑'), err);
        }
    });
    console.log(logSymbols.success, 'ecosystem.config.js 初始化完成');
}