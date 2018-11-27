const path = require('path');
const express = require('express');
const webpack = require('webpack');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const config = require('./webpack.config.prod.js');
app.use(express.static(path.join(__dirname, 'static/dist')));
app.get('/*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'static/dist/index.html'));
});

app.listen(process.env.WEB_SERVER_PORT, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', process.env.WEB_SERVER_PORT, process.env.WEB_SERVER_PORT);
});
