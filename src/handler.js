const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getUsers = (request, response) => {
  if (request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(users));
  } else if (request.method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
  }
  response.end();
};

const notReal = (request, response) => {
  if (request.method === 'GET') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'The page you are looking for was not found.', id: 'notFound' }));
  } else if (request.method === 'HEAD') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
  }

  response.end();
};

const addUser = (request, response, body) => {
  if (request.method === 'POST') {
    if (body.name && body.age) {
      if (users[body.name]) {
        users[body.name].age = body.age;
        response.writeHead(204);
      } else {
        users[body.name] = { name: body.name, age: body.age };
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Created successfully.' }));
      }
    } else {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'Name and age are both required.', id: 'missingParams' }));
    }
    response.end();
  }
};

const notFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ message: 'The page you are looking for was not found.', id: 'notFound' }));
  response.end();
};

module.exports.getIndex = getIndex;
module.exports.getUsers = getUsers;
module.exports.notReal = notReal;
module.exports.addUser = addUser;
module.exports.getCSS = getCSS;
module.exports.notFound = notFound;
