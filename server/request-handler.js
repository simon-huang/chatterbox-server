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

var requestHandler = function(request, response) {
  var fs = require('fs');
  var headers = defaultCorsHeaders;

  // console.log(JSON.parse(htmlPageData));
  var messages;
  var statusCode;
 
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  request.on('error', function(error) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.write(htmlPageData);
    response.end('error', error);
  });

  // if (request.url.indexOf('/classes/messages') === -1) {
  //   console.log('wrong endpoint');
  //   statusCode = 404;
  //   response.writeHead(statusCode, headers);
  //   response.write(htmlPageData);
  //   response.end('error');

  
  // } else 
  if (request.method === 'OPTIONS') {
    var headers = {};
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
    response.writeHead(200, headers);
    response.write(htmlPageData);
    response.end();
  
  } else if (request.method === 'GET') {
    //index.html 
    if (request.url === '/' || request.url.indexOf('/username') !== -1) {
      fs.readFile('./client/index.html', function(err, htmlPageData) {
        headers['Content-Type'] = 'text/html';
        response.writeHead(200, headers);  
        response.write(htmlPageData);
        response.end();
      });
    }
      
    if (request.url === '/styles/styles.css') {

      fs.readFile('./client/styles/styles.css', function(err, cssfile) {
        headers['Content-Type'] = 'text/css';
        response.writeHead(200, headers);
        response.write(cssfile);
        response.end();
      });

    } else if (request.url === '/bower_components/jquery/dist/jquery.js') {

      fs.readFile('./client/bower_components/jquery/dist/jquery.js', function(err, jquerryfile) {
        headers['Content-Type'] = 'application/javascript';
        response.writeHead(200, headers);
        response.write(jquerryfile);
        response.end();
      });

    } else if (request.url === '/scripts/app.js') {
      fs.readFile('./client/scripts/app.js', function(err, app) {
        headers['Content-Type'] = 'application/javascript';
        response.writeHead(200, headers);
        response.write(app);
        response.end();
      });
    } else if (request.url.indexOf('/classes/messages') !== -1) {

      fs.readFile('message.txt', (err, data) => {
        if (err) {
          console.log('error');
          throw err;
        }
        messages = JSON.parse(data);
        headers['Content-Type'] = 'application/json';
        statusCode = 200;
        response.writeHead(statusCode, headers);

        response.end(JSON.stringify( {results: messages} ));
      });
    }

    
  } else if (request.method === 'POST') {
    fs.readFile('message.txt', (err, data) => {
      if (err) {
        console.log('error');
        throw err;
      }
      messages = JSON.parse(data);
      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.write(htmlPageData);
      request.on('data', function(data) {
        var current = JSON.parse(data);
        current.objectId = messages.length + 1;
        messages.unshift(current);
        fs.writeFile('message.txt', JSON.stringify(messages), (err) => {
          if (err) {
            console.log(err);
          }
          console.log('It\'s saved!');
        });
      });
      response.end(JSON.stringify(messages));
    }); 
    
  }

  
};


module.exports.requestHandler = requestHandler;