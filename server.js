const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const baseDirectory = __dirname; // or whatever base directory you want

const port = 3000;

http.createServer((request, response) => {
  try {
    let { pathname } = url.parse(request.url);

    // need to use path.normalize so people can't access directories underneath baseDirectory
    pathname = pathname === '/' ? '/index.html' : pathname;
    const fsPath = baseDirectory + path.normalize(pathname);

    // Force correct content-type for JavaScript
    // This is a work-around for an issue where
    // es6 modules have "" as content-type.
    if (fsPath.endsWith('.js')) {
      response.setHeader('content-type', 'text/javascript');
    }

    const fileStream = fs.createReadStream(fsPath);

    fileStream.pipe(response);
    fileStream.on('open', () => {
      response.writeHead(200);
    });
    fileStream.on('error', (e) => {
      console.log(e);
      response.writeHead(404); // assume the file doesn't exist
      response.end();
    });
  } catch (e) {
    response.writeHead(500);
    response.end(); // end the response so browsers don't hang
    console.log(e.stack);
  }
}).listen(port);

console.log(`listening on port ${port}`);
