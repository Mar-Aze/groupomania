const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const port = process.env.PORT;

app.set('port', port);
server.listen(port);
console.log(`Listening on port ${port}`);
