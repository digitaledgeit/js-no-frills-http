var URL       = require('url');
var HTTP      = require('http');
var HTTPS     = require('https');
var Stream    = require('stream');

/**
 * Maps the user friendly agent options to native nodejs agent options
 * @param   {String} protocol
 * @param options
 * @returns {*}
 */
function agent_options(protocol, options) {
  var nodeOptions;

  //keepAlive Boolean Keep sockets around in a pool to be used by other requests in the future. Default = false
  //keepAliveMsecs Integer When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000. Only relevant if keepAlive is set to true.
  //maxSockets Number Maximum number of sockets to allow per host. Default = Infinity.
  //qmaxFreeSockets Number Maximum number of sockets to leave open in a free state. Only relevant if keepAlive is set to true. Default = 256.
  //
  //pfx: Certificate, Private key and CA certificates to use for SSL. Default null.
  //key: Private key to use for SSL. Default null.
  //passphrase: A string of passphrase for the private key or pfx. Default null.
  //cert: Public x509 certificate to use. Default null.
  //ca: An authority certificate or array of authority certificates to check the remote host against.
  //ciphers: A string describing the ciphers to use or exclude. Consult http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT for details on the format.
  //secureProtocol: The SSL method to use, e.g. SSLv3_method to force SSL version 3. The possible values depend on your installation of OpenSSL and are defined in the constant SSL_METHODS.
  //


  if (options) {

    if (protocol === 'https:') {

      if (options.https_protocol) {
        nodeOptions = nodeOptions || {};
        nodeOptions.secureProtocol = options.https_protocol;
      }

      //whether the client should ignore certificate errors caused by the certificate not being known by the registered Certificate Authorities
      if (options.https_ignore_errors) {
        nodeOptions = nodeOptions || {};
        nodeOptions.rejectUnauthorized = !options.https_ignore_errors;
      }

    }

  }

  return nodeOptions;
}

/**
 * Perform a HTTP request
 * @param {String}          method
 * @param {String}          url
 * @param {Object}          [options]
 * @param {Object}          [options.headers]
 * @param {String|Stream}   [options.body]
 * @param {String}          [options.agent.https_protocol]
 * @param {Boolean}         [options.agent.https_ignore_errors]
 * @param {Function}        callback
 */
function request(method, url, options, callback) {

  if (typeof(callback) === 'undefined' && typeof(options) === 'function') {
    callback  = options;
    options   = {};
  }

  var client, agent;
  var parsedUrl     = URL.parse(url);
  var agentOptions  = agent_options(parsedUrl.protocol, options.agent);

  switch (parsedUrl.protocol) {

    case 'http:':
      client  = HTTP;
      if (agentOptions) {
        agent = new HTTP.Agent(agentOptions);
      }
      break;

    case 'https:':
      client = HTTPS;
      if (agentOptions) {
        agent = new HTTPS.Agent(agentOptions);
      }
      break;

    default:
      throw new Error('Unsupported protocol: '+parsedUrl.protocol);
  }

  var req = client.request({
    method:   method,
    hostname: parsedUrl.hostname,
    port:     parsedUrl.port,
    path:     parsedUrl.path,
    auth:     parsedUrl.auth,
    headers:  options.headers || {},
    agent:    agent
  });

  req.on('response', function(res) {
    res.url = parsedUrl;
    callback(undefined, res);
  });

  req.on('error', function(err) {
    callback(err);
  });

  //write or pipe the body data
  if (options.body) {
    if (options.body instanceof Stream) { //should be Stream.Readable but not everyone implements it
      options.body.pipe(req);
    } else if (options.body instanceof Buffer) {
      req.write(options.body);
      req.end();
    } else {
      req.write(String(options.body));
      req.end();
    }
  } else {
    req.end();
  }

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

request.delete = function(url, options, callback) {
  return request('DELETE', url, options, callback);
};

module.exports = request;
