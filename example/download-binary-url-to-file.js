var fs = require('fs');
var url = require('url');
var path = require('path');
var request = require('..');

request.get('http://www.google.com/images/srpr/logo11w.png', function(err, res) {
  if (err) return console.log(err);

  var
    fname    = './'+path.basename(url.parse(res.url).path),
    fstream  = fs.createWriteStream(fname)
  ;

  fstream.on('close', function() {
    console.log(res.url.href+' saved to '+fname);
  });

  res.pipe(fstream);

});
