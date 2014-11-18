var request = require('..');

request.get(
  'https://api.github.com/users/digitaledgeit',
  {
    headers: {'User-Agent': 'request-on-steroids'}
  },
  function(err, res) {
    if (err) return console.log(err);
    res.pipe(process.stdout);
  }
);
