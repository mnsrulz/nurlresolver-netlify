'use strict';
import express, { Router } from 'express';
import { join } from 'path';
import serverless from 'serverless-http';
const app = express();
import { json } from 'body-parser';
const router = Router();
import nurlresolver from 'nurlresolver';
import cors from 'cors';

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/resolve', async (req, res) => {
  const { q, m, r, t } = req.query;

  if (typeof (q) == 'string') {
    const fn = r === 'true' ? nurlresolver.resolveRecursive : nurlresolver.resolve;
    const result = await fn(q, {
      extractMetaInformation: typeof (m) === 'string' && m === 'true',
      timeout: typeof (t) == 'string' ? parseInt(t) : 8 || 8,  //8 seconds of timeout default
      customResolvers: []
    });
    res.json(result);
  } else {
    res.status(400).json({ error: 'Query param q not defined' });
  }
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(cors());
app.use(json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(join(__dirname, '../index.html')));

// export default app;
export const handler = serverless(app);