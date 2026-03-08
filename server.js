http://100.120.67.89:3000/const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = './build';

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

// For CommonJS, we need to use require for the build
const buildPath = path.resolve(__dirname, BUILD_DIR);
const build = require(buildPath + '/index.js');

const requestHandler = createRequestHandler({
  build: build,
  mode: process.env.NODE_ENV,
});

app.all('*', requestHandler);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`🚀 Server ready at http://${host}:${port}`);
});