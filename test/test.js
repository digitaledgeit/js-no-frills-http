var assert = require('assert');
var server = require('./server');
var request = require('..');

var fs = require('fs');
var https = require('https');
var httpsAgent = new https.Agent({rejectUnauthorized: false});

describe('no-frills-http', function() {

  describe('.get()', function() {

    function get(secure, done) {
      var status  = 200;
      var header  = 'application/json; charset=utf-8';
      var content = '{ "Message": "Hello World!" }';

      //create the server
      var app = server(function(req, res, next) {
        res.statusCode = status;
        res.set('Content-Type', header);
        res.send(content);
        next();
      }, {secure: secure});

      //perform the request
      request.get('http://localhost:3000/', {agent: secure ? httpsAgent : null}, function(err, res) {

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

          app.close();
          done();

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
      var app = server(function(req, res, next) {
        res.statusCode = status;
        res.set('Content-Type', header);
        res.send(content);
        next();
      }, {secure: secure, method: 'post'});

      //perform the request
      request.post('http://localhost:3000/', {agent: secure ? httpsAgent : null}, function(err, res) {

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

          app.close();
          done();

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
