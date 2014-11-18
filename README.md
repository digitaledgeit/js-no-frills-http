# no-frills-http

A super light weight wrapper for sending HTTP requests.

## Installation

	$ npm install --save request-on-steroids
	
## Example
	
### Download a binary file
	
	var fs = require('fs');
	var path = require('path');
	var request = require('request-on-steroids');
	
	request.get('http://www.google.com/images/srpr/logo11w.png', function(err, res) {
	  if (err) return console.log(err);
	
	  if (res.headers['content-type'].split(';')[0] === 'text/html') {
	  
	  res.on('data', function() {
        console.log(res.url+' saved to '+fname);
      });
	  
	  } else {
	  
	  	  var
      	    fname    = './'+path.basename(res.url.path),
      	    fstream  = fs.createWriteStream(fname)
      	  ;
      	
      	  fstream.on('close', function() {
      	    console.log(res.url+' saved to '+fname);
      	  });
      	
      	  res.pipe(fstream);
      	
	  }

	});
