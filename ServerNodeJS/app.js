var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
const WebSocket = require('ws');
const WS_PORT = 8888;
const HTTP_PORT = 8000;

const mongoose = require('mongoose');
const config = require('./config/default.json');

mongoose.connect(config.conn_string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log('done connect'))
  .catch(err => console.log('errrr' + err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(express.static(path.join(__dirname, 'public')));

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS Server is listening at ${WS_PORT}`));
let connectedClients = [];
wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    connectedClients.push(ws);

    ws.on('message', data => {
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        })
    });
});

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(HTTP_PORT);


