module.exports = {
    replaceConsole: true,
    appenders: {
        console: {
            type: 'console'
        },
        file: {
            type: 'file',
            filename: 'logs/npmmodules.log',
            maxLogSize: 204800,
            backups: 1000
        },
        datefile: {
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'npmmodules_yyyyMMdd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: [
                'console'
            ],
            level: 'ALL'
        },
        datefile: {
            appenders: [
                'datefile'
            ],
            level: 'ALL'
        },
        file: {
            appenders: [
                'file'
            ],
            level: 'ALL'
        }
    }
}