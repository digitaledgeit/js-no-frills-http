var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

module.exports = function(fn, options) {
  var server, app = express();

  options         = options || {};
  options.secure  = options.secure || false;
  options.method  = options.method || 'get';

  app[options.method].call(app, '/', fn);

  if (options.secure) {
    server = https.createServer({
      key:    fs.readFileSync(module.exports.key),
      cert:   fs.readFileSync(module.exports.cert)
    }, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(module.exports.port, module.exports.host);

  return server;
};

module.exports.host = 'localhost';
module.exports.port = 3000;

module.exports.key  = __dirname+'/key.pem';
module.exports.cert = __dirname+'/cert.pem';

