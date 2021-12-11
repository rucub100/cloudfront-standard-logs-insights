const fs = require('fs/promises');

const { LogFile } = require('./model/LogFile');

class LogsReader {
    constructor() {
        this.logFiles = [];
    }

    loadLogs() {
        return fs
            .readdir('.logs')
            .then((logFiles) => {
                console.log(`Gather ${logFiles.length} log files...`);
                for (const file of logFiles) {
                    const [distribution, rawDate, id, fileExtension] =
                        file.split('.');
                    const date = rawDate.substring(0, 10);

                    console.log(
                        `Found ${fileExtension}-log-file (${id}) - distribution: '${distribution}', date: '${date}'`
                    );

                    this.logFiles.push(new LogFile(file));
                }
            })
            .then(async () => {
                for (const logFile of this.logFiles) {
                    await logFile.load();
                }
            });
    }
}

module.exports = {
    LogsReader,
};
