var request = require('..');

request.post(
  'http://localhost/contact/',
  {
    headers: {
      'User-Agent':   'request-on-steroids',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'firstName=John&lastName=Smith&email=john@example.com&message=testing%20123'
  },
  function(err, res) {
    if (err) return console.log(err);
    res.pipe(process.stdout);
  }
);
