const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/src/resources')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

http.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
