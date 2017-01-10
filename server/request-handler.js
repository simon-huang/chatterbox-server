/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = [];

var requestHandler = function(request, response) {

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  request.on('error', function(error) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('error', error);
  });

  if (request.url.indexOf('/classes/messages') === -1) {
    console.log('wrong endpoint');
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('rror');
 
  
  } else if (request.method === 'OPTIONS') {
    var headers = {};
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
    response.writeHead(200, headers);
    response.end();
  
  } else if (request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify( {results: messages} ));
  } else if (request.method === 'POST') {
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('data', function(data) {
      var current = JSON.parse(data);
      current.objectId = messages.length + 1;
      messages.unshift(current);
    });
    response.end(JSON.stringify(messages));
  }
};


module.exports.requestHandler = requestHandler;