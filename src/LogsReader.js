const fs = require('fs/promises');

const { LogFile, knownFields } = require('./model/LogFile');

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

    getData() {
        return {
            columns: knownFields,
            rows: this.logFiles.flatMap((logFile) => logFile.log),
        };
    }

    getOverview() {
        const dateSet = new Set();
        const ipSet = new Set();
        const xForwardedForSet = new Set();
        const edgeLocationSet = new Set();
        const userAgents = new Set();
        const methodSet = new Set();
        const hostSet = new Set();
        const pathSet = new Set();
        const statusSet = new Set();
        const refererSet = new Set();
        const uriQuerySet = new Set();
        const cookieSet = new Set();
        const protocolSet = new Set();
        const sslProtocolSet = new Set();
        const sslCipher = new Set();

        let timeTakenArray = [];

        let csBytes = 0;
        let scBytes = 0;

        const rows = this.logFiles.flatMap((logFile) => logFile.log);
        for (const row of rows) {
            dateSet.add(row['date']);
            ipSet.add(row['c-ip']);
            edgeLocationSet.add(row['x-edge-location']);
            userAgents.add(row['cs(User-Agent)']);
            methodSet.add(row['cs-method']);
            hostSet.add(row['cs(Host)']);
            pathSet.add(row['cs-uri-stem']);
            statusSet.add(row['sc-status']);
            refererSet.add(row['cs(Referer)']);
            uriQuerySet.add(row['cs-uri-query']);
            cookieSet.add(row['cs(Cookie)']);
            protocolSet.add(row['cs-protocol']);
            xForwardedForSet.add(row['x-forwarded-for']);
            sslProtocolSet.add(row['ssl-protocol']);
            sslCipher.add(row['ssl-cipher']);

            timeTakenArray.push(Number.parseFloat(row['time-taken']));

            csBytes += Number.parseInt(row['cs-bytes']);
            scBytes += Number.parseInt(row['sc-bytes']);
        }

        const sortedDates = Array.from(dateSet).sort();

        timeTakenArray = timeTakenArray.filter((value) => value > 0);
        timeTakenArray.sort();

        return {
            dateRange: {
                startDate: sortedDates[0],
                endDate: sortedDates[sortedDates.length - 1],
            },
            numberOfIps: ipSet.size,
            numberOfRequests: rows.length,
            numberOfBytesIn: this._formatBytes(csBytes),
            numberOfBytesOut: this._formatBytes(scBytes),
            Ips: Array.from(ipSet).sort(),
            xForwardedFor: Array.from(xForwardedForSet),
            timeTakenMs: {
                min: Math.round(timeTakenArray[0] * 1000),
                max: Math.round(
                    timeTakenArray[timeTakenArray.length - 1] * 1000
                ),
                median: Math.round(
                    timeTakenArray[Math.floor(timeTakenArray.length / 2)] * 1000
                ),
                avg: Math.round(
                    (timeTakenArray.reduce(
                        (previousValue, currentValue) =>
                            previousValue + currentValue
                    ) /
                        timeTakenArray.length) *
                        1000
                ),
            },
            edgeLocations: Array.from(edgeLocationSet).sort(),
            userAgents: Array.from(userAgents).sort(),
            httpMethods: Array.from(methodSet),
            hosts: Array.from(hostSet).sort(),
            referers: Array.from(refererSet).sort(),
            paths: Array.from(pathSet).sort(),
            uriQueries: Array.from(uriQuerySet),
            statusCodes: Array.from(statusSet),
            cookies: Array.from(cookieSet),
            protocols: Array.from(protocolSet),
            sslProtocols: Array.from(sslProtocolSet),
            sslCipher: Array.from(sslCipher),
        };
    }

    _formatBytes(bytes) {
        if (bytes < 1024) {
            return bytes.toString();
        } else if (bytes < 1024 * 1024) {
            return `${Math.round(bytes / 1024)}KB`;
        } else if (bytes < 1024 * 1024 * 1024) {
            return `${Math.round(bytes / (1024 * 1024))}MB`;
        } else if (bytes < 1024 * 1024 * 1024 * 1024) {
            return `${Math.round(bytes / (1024 * 1024 * 1024))}GB`;
        }
    }
}

module.exports = {
    LogsReader,
};
