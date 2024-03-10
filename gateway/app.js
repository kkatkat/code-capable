const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer({});

const userMicroservice = 'http://localhost:3001';
const problemMicroservice = 'http://localhost:3000';
const runnerMicroservice = 'http://localhost:3002';

app.use('/u', (req, res) => {
    proxy.web(req, res, { target: userMicroservice });
})

app.use('/p', (req, res) => {
    proxy.web(req, res, { target: problemMicroservice });
})

app.use('/r', (req, res) => {
    proxy.web(req, res, { target: runnerMicroservice });
})

proxy.on('error', (err, req, res) => {
    console.log(err)
    res.status(500).send('Something went wrong.');
});

const port = 8000;
app.listen(port, () => {
    console.log(`Gateway running on port ${port}`);
})