'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
const router = express.Router();
const nurlresolver = require('nurlresolver');
const cors = require('cors');

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/resolve', async (req, res) => {
  const { q, m, r, t } = req.query;

  if (q) {
    const options = {
      extractMetaInformation: m && m === 'true',
      timeout: parseInt(t) || 8  //8 seconds of timeout default
    };
    const result = r === 'true' ? await nurlresolver.resolveRecursive(q, options)
                                : await nurlresolver.resolve(q, options);
    res.json(result);
  } else {
    res.status(400).json({ error: 'Query param q not defined' });
  }
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);