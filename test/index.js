var assert = require('assert');
var server = require('simple-server-setup');
var request = require('..');

var HTTPS_SERVER_OPTIONS = {
  secure: true,
  key:    __dirname+'/server.key',
  cert:   __dirname+'/server.cert'
};

var https = require('https');
var httpsAgent = new https.Agent({rejectUnauthorized: false});

describe('no-frills-http', function() {

  describe('.get()', function() {

    function get(secure, done) {
      var status  = 200;
      var header  = 'application/json; charset=utf-8';
      var content = '{ "Message": "Hello World!" }';

      //create the server
      var srv = server.create(secure ? HTTPS_SERVER_OPTIONS : {}, function(app) {
        app.get('/', function(req, res) {
          res.statusCode = status;
          res.set('Content-Type', header);
          res.send(content);
        });
      });

      //perform the request
      request.get(srv.url, {agent: secure ? httpsAgent : null}, function(err, res) {

        //assert no error occurred
        assert(!err, err);

        //assert we have the status code
        assert.equal(
          res.statusCode,
          status
        );

        //assert we have got the header
        assert.equal(
          res.headers['content-type'],
          header //note it gets cast to lowercase
        );

        var buffer = '';
        res.on('data', function(data) {
          buffer += data.toString();
        });

        res.on('end', function() {

          //assert we have the content
          assert.equal(
            buffer,
            content
          );

          srv.close(done);

        });

      });

    }

    it('should have status code, headers and body for http request', function(done) {
      get(false, done);
    });

    it('should have status code, headers and body for https request', function(done) {
      get(true, done);
    });

  });

  describe('.post()', function() {

    function post(secure, done) {
      var status  = 201;
      var header  = 'application/json; charset=utf-8';
      var content = '{ "Message": "Hello World!" }';

      //create the server
      var srv = server.create(secure ? HTTPS_SERVER_OPTIONS : {}, function(app) {
        app.post('/', function(req, res) {
          res.statusCode = status;
          res.set('Content-Type', header);
          res.send(content);
        });
      });

      //perform the request
      request.post(srv.url, {agent: secure ? httpsAgent : null}, function(err, res) {

        //assert no error occurred
        assert(!err, err);

        //assert we have the status code
        assert.equal(
          res.statusCode,
          status
        );

        //assert we have got the header
        assert.equal(
          res.headers['content-type'],
          header //note it gets cast to lowercase
        );

        var buffer = '';
        res.on('data', function(data) {
          buffer += data.toString();
        });

        res.on('end', function() {

          //assert we have the content
          assert.equal(
            buffer,
            content
          );

          srv.close(done);

        });

      });

    }

    it('should have status code, headers and body for http request', function(done) {
      post(false, done);
    });

    it('should have status code, headers and body for https request', function(done) {
      post(true, done);
    });

  });

});
