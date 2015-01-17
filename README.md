# no-frills-request

A super low-level, light-weight wrapper for sending and receiving HTTP requests. 

This module abstracts the HTTP/HTTPS modules and not a whole lot more.

## Installation

	$ npm install --save no-frills-request
	
## Example

### Concatenate a text URL to string
	
	var request = require('no-frills-request');
	
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
		
### Download a binary URL to file
	
	var fs = require('fs');
	var path = require('path');
	var request = require('no-frills-request');
	
	request.get('http://www.google.com/images/srpr/logo11w.png', function(err, res) {
	  if (err) return console.log(err);
	
	  var
		fname    = './'+path.basename(res.url.path),
		fstream  = fs.createWriteStream(fname)
	  ;
	
	  fstream.on('end', function() {
		console.log(res.url.href+' saved to '+fname);
	  });
	
	  res.pipe(fstream);
	
	});
	
## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.