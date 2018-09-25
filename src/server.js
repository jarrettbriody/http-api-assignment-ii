const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./handler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': handler.getIndex,
  '/style.css': handler.getCSS,
  '/getUsers': handler.getUsers,
  '/notReal': handler.notReal,
  '/addUser': handler.addUser,
  notFound: handler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  if (urlStruct[parsedUrl.pathname]) {
    if (request.method === 'GET' || request.method === 'HEAD') {
      urlStruct[parsedUrl.pathname](request, response, params);
    } else if (request.method === 'POST') {
      const body = [];

      request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
      });

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);
        urlStruct[parsedUrl.pathname](request, response, bodyParams);
      });
    }
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);
