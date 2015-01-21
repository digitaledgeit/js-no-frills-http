var request = require('..');

request.post(
  'http://httpbin.org/post',
  {
    headers: {
      'User-Agent':   'no-frills-request',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'firstName=John&lastName=Smith&email=john@example.com&message=testing%20123'
  },
  function(err, res) {
    if (err) return console.log(err);
    res.pipe(process.stdout);
  }
);
