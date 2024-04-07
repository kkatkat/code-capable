const express = require('express');
const httpProxy = require('http-proxy');
const { config } = require('dotenv'); 
const { resolve } = require('path');
const cors = require('cors');

// load env
config({ path: resolve(process.cwd(), '.env')});

const app = express();
app.use(cors());

const proxy = httpProxy.createProxyServer({});

const userMicroservice = 'http://' + process.env.USER_MS
const problemMicroservice = 'http://' + process.env.PROBLEM_MS
const runnerMicroservice = 'http://' + process.env.RUNNER_MS

console.log(userMicroservice, problemMicroservice, runnerMicroservice);

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