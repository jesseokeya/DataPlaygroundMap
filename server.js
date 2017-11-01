const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const logger = require('morgan');
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '/src/resources')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

app.post('/data-playground', (req, res) => {
  let result = {};
  if (req.body.mapData) {
    io.emit('mapData', req.body.mapData);
    result = {
      status: 200,
      dataRecieved: req.body.mapData
    }
  } else {
    result = {
      status: 404,
      dataRecieved: null
    }
  }

  res.send(result);
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

http.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
