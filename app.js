const { join } = require('path');
const express = require('express');

const { LogsReader } = require('./src/LogsReader');

const app = express();
const port = 3000;

const logsReader = new LogsReader();

app.use(express.static('dist'));

app.get('/api/overview', (req, res) => {
    res.send(logsReader.getOverview());
});

app.get('/api/data', (req, res) => {
    res.send(logsReader.getData());
});

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

logsReader.loadLogs().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
