var URL       = require('url');
var HTTP      = require('http');
var HTTPS     = require('https');

/**
 * Perform a HTTP request
 * @param {string}    method
 * @param {string}    url
 * @param {object}    [options]
 * @param {function}  callback
 */
function request(method, url, options, callback) {

  if (typeof(callback) === 'undefined' && typeof(options) === 'function') {
    callback  = options;
    options   = {};
  }

  var client;
  var parsedUrl = URL.parse(url);

  switch (parsedUrl.protocol) {

    case 'http:':
      client = HTTP;
      break;

    case 'https:':
      client = HTTPS;
      break;

    default:
      throw new Error('Unsupported protocol: '+parsedUrl.protocol);
  }

  var req = client.request({
    method:   method,
    hostname: parsedUrl.hostname,
    port:     parsedUrl.port,
    path:     parsedUrl.path,
    auth:     options.auth || parsedUrl.auth,
    headers:  options.headers || {},
    agent:    options.agent
  });

  req.on('response', function(res) {
    res.url = parsedUrl;
    callback(undefined, res);
  });

  req.on('error', function(err) {
    console.log('Error received');
    callback(err);
  });

  //write or pipe the data
  if (options.data) {
    if (typeof(options.data.pipe) === 'function') {
      options.data.pipe(req);
    } else {
      req.write(String(options.data));
    }
  }

  req.end();

};

request.get = function(url, options, callback) {
  return request('GET', url, options, callback);
};

request.post = function(url, options, callback) {
  return request('POST', url, options, callback);
};

request.put = function(url, options, callback) {
  return request('PUT', url, options, callback);
};

module.exports = request;
