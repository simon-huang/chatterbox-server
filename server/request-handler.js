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
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  //console.log("REQUEST: ", request);
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.method === 'OPTIONS') {
    console.log('OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    response.writeHead(200, headers);
    response.end();
  } else {
  //...other requests
    // The outgoing status.
    var statusCode;
    if (request.url.indexOf('/classes/messages') === -1) {
      statusCode = 404;
      request.on('error', function(error) {
        response.end('error', error);
      });
    } else if (request.method === 'GET') {
      statusCode = 200;
    } else if (request.method === 'POST') {
      statusCode = 201;
    }
    // See the note below about CORS headers.


    
    var headers = defaultCorsHeaders;

    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'text/plain';

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);
    
    // if (request.method === 'OPTIONS') {
    //   response.writeHead(200, {
    //     'Allow': 'HEAD,GET,PUT,DELETE,OPTIONS',
    //   });
    //   response.end('No'); 
    // }

    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    //response.end('Hello, World!');
    if (request.method === 'GET') {
      //console.log('retrieved messages', messages);
      response.end(JSON.stringify({results: messages.sort(function(a, b) {
        return b.objectId - a.objectId; 
      })}));  
    } else if (request.method === 'POST') {
      request.on('data', function(data) {
        console.log('data', JSON.parse(data));
        var current = JSON.parse(data);
        current.objectId = messages.length + 1;
        messages.push(current);
        console.log('after pushing to messages', messages);
      });
      response.end(JSON.stringify(messages));
      //response.end(messages); 
    }
  }
  
   
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;
