// Initialize express;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors');
const ws = require('ws');

let WebSocket = ws.Server;
let  wss = new WebSocket({port: 8800});

wss.on('connection', function (ws) {
    ws.on('message', function (message) {

        wss.clients.forEach(client => {
            client.send(message);
        });
    });
});


// Initialize firebase;
const firebase = require('firebase-admin');
firebase.initializeApp({
    credential: firebase.credential.cert(require('./service-account-key.json'))
});

// Configure app for use body-parser;
// app.use(cors());
app.use(function (req, res, next)
{
    console.log('-=-=q-e=q-e=qw-e=qw-e=qw-e=qw-ec=qw-ec=qw-ec=qw-ce=qw-ec=qw-ce=qw-ec=qw-ce=qw-')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json());

// Add access control allow origin header;


// Initialize database;
global.Sequelize = require('sequelize');
global.sequelize = new Sequelize('mysql://avadak00_skills:cjxr8b38@avadak00.mysql.tools:3306/avadak00_skills');

// Create routes;
app.use(require('./routes'));

// Return api routes;
module.exports = app;
