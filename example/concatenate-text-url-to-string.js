var request = require('..');

request.get('https://www.google.com.au/', function(err, res) {
  if (err) return console.log(err);

  var body = '';

  res.on('data', function(data) {
    body += data.toString();
  });

  res.on('end', function() {
    console.log(body);
  });

});