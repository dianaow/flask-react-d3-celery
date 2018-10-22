const path = require('path');
const express = require('express');
const httpProxy = require('http-proxy');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.dev.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

app.get('/api/races', function (req, res) {
  console.log('redirecting to flask api server');
  proxy.web(req, res, {
    target: "http://" + process.env.API_SERVER_HOST + ":" + process.env.API_SERVER_PORT + "/api/races"
  });
});

if (isDeveloping) {

  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'static/dist/index.html')));
    res.end();
  });

  
} else {

  app.use(express.static(__dirname + '/static'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'static/dist/index.html'));
  });

}

proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(process.env.WEB_SERVER_PORT, process.env.WEB_SERVER_HOST, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up %s in your browser.', process.env.WEB_SERVER_PORT, "http://" + process.env.WEB_SERVER_HOST + ":" + process.env.WEB_SERVER_PORT);
});