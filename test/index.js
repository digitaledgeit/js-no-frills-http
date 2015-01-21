var assert = require('assert');
var server = require('simple-server-setup');
var request = require('..');
var parser  = require('body-parser');
var StringStream = require('string-stream');

var HTTPS_SERVER_OPTIONS = {
  secure: true,
  key:    __dirname+'/server.key',
  cert:   __dirname+'/server.cert'
};

var AGENT_OPTIONS = {
  https_ignore_errors: true
};

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

      srv.on('configured', function() {

        //perform the request
        request.get(srv.url, {agent: AGENT_OPTIONS}, function (err, res) {

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
          res.on('data', function (data) {
            buffer += data.toString();
          });

          res.on('end', function () {

            //assert we have the content
            assert.equal(
              buffer,
              content
            );

            srv.close(done);

          });

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

      srv.on('configured', function() {

        //perform the request
        request.post(srv.url, {body: content, agent: AGENT_OPTIONS}, function(err, res) {

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

      });

    }

    it('should have status code, headers and body for http request', function(done) {
      post(false, done);
    });

    it('should have status code, headers and body for https request', function(done) {
      post(true, done);
    });

    it('should send a string body', function(done) {

      var srv = server.create(function(app) {
        app.use(parser.text());
        app.post('/', function(req, res) {
          assert.equal(req.body, 'Hello World!');
          res.end();
          srv.close();
        });
      });

      srv.on('configured', function() {

        request.post(srv.url, {headers: {'Content-Type': 'text/plain'}, body: 'Hello World!'}, function(error, response) {
          if (error) throw error;
          response.resume();
          response.on('end', done);
        });

      });

    });

    it('should send a buffer body', function(done) {

      var srv = server.create(function(app) {
        app.use(parser.text());
        app.post('/', function(req, res) {
          assert.equal(req.body, 'Hello World!');
          res.end();
          srv.close();
        });
      });

      srv.on('configured', function() {

        request.post(srv.url, {headers: {'Content-Type': 'text/plain'}, body: 'Hello World!'}, function(error, response) {
          if (error) throw error;
          response.resume();
          response.on('end', done);
        });

      });

    });

    it('should send a stream body', function(done) {

      var srv = server.create(function(app) {
        app.use(parser.text());
        app.post('/', function(req, res) {
          assert.equal(req.body, 'Hello World!');
          res.end();
          srv.close();
        });
      });

      srv.on('configured', function() {

        request.post(srv.url, {headers: {'Content-Type': 'text/plain'}, body: 'Hello World!'}, function(error, response) {
          if (error) throw error;
          response.resume();
          response.on('end', done);
        });

      });

    });

  });

});
