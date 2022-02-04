const http = require('http');
const PORT = 4000

const express = require('express');

const app = express();

app.use(express.static('src'));

http.createServer(app).listen(PORT, () => {
  console.log('listen ::: ', PORT);
})