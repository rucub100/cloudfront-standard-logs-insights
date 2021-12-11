const { join } = require('path');
const { readFileSync } = require('fs');
const { gunzipSync } = require('zlib');

const knownFields = [
    'date',
    'time',
    'x-edge-location',
    'sc-bytes',
    'c-ip',
    'cs-method',
    'cs(Host)',
    'cs-uri-stem',
    'sc-status',
    'cs(Referer)',
    'cs(User-Agent)',
    'cs-uri-query',
    'cs(Cookie)',
    'x-edge-result-type',
    'x-edge-request-id',
    'x-host-header',
    'cs-protocol',
    'cs-bytes',
    'time-taken',
    'x-forwarded-for',
    'ssl-protocol',
    'ssl-cipher',
    'x-edge-response-result-type',
    'cs-protocol-version',
    'fle-status',
    'fle-encrypted-fields',
    'c-port',
    'time-to-first-byte',
    'x-edge-detailed-result-type',
    'sc-content-type',
    'sc-content-len',
    'sc-range-start',
    'sc-range-end',
];

class LogFile {
    constructor(file) {
        this.file = file;
        this.log = [];
    }

    async load() {
        return new Promise((resolve, reject) => {
            try {
                const buffer = readFileSync(join('.logs', this.file));
                const content = gunzipSync(buffer).toString();
                this._parse(content);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    _parse(content) {
        const lines = content.split(/\r?\n/);

        if (lines.length <= 3) {
            throw new Error('file is empty');
        }

        if (lines[0] !== '#Version: 1.0' || !lines[1].startsWith('#Fields:')) {
            throw new Error('unknown file format');
        }

        const fields = lines[1].split(/\s/).slice(1);

        if (fields.length !== knownFields.length) {
            throw new Error('unexpected number of columns');
        }

        for (const field of fields) {
            if (!knownFields.includes(field)) {
                throw new Error('unknown field detected, file may be corrupt');
            }
        }

        for (const line of lines.slice(2)) {
            const columns = line.split(/\s/);
            if (columns.length !== knownFields.length) {
                break;
            }

            const row = columns
                .map((value, index) => {
                    return { [knownFields[index]]: value };
                })
                .reduce((previousValue, currentValue, currentIndex) => {
                    return { ...previousValue, ...currentValue };
                });
            this.log.push(row);
        }
    }
}

module.exports = {
    LogFile,
    knownFields,
};
