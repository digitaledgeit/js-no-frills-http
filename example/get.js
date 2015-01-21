var request = require('..');

request.get(
  'https://api.github.com/users/digitaledgeit',
  {
    headers: {'User-Agent': 'no-frills-request'}
  },
  function(err, res) {
    if (err) return console.log(err);
    res.pipe(process.stdout);
  }
);
