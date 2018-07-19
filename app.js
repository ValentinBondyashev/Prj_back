// Initialize express;
require('dotenv').config({path: './.env'})
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const OnSkillUpdateEvent = require('./app/Events/OnSkillUpdate');
const logSkills  = require('./app/Controllers/skills').getSkillsLogs;
const ws = require('ws');

let WebSocket = ws.Server;
let  WebSocketServer = new WebSocket({port: 8800});

WebSocketServer.on('connection', function connection(ws) {

});

require('./app/Models/connection');

OnSkillUpdateEvent.on('update_skill', async function(){
    var skills = await logSkills();
    console.log(skills);

    WebSocketServer.clients.forEach(client => {

        client.send(skills);
    });

});

// Initialize firebase;
const firebase = require('firebase-admin');
firebase.initializeApp({
    credential: firebase.credential.cert(require('./service-account-key.json'))
});

// Configure app for use body-parser;
//app.use(cors());
app.use(function (req, res, next)
{
    // console.log('-=-=q-e=q-e=qw-e=qw-e=qw-e=qw-ec=qw-ec=qw-ec=qw-ce=qw-ec=qw-ce=qw-ec=qw-ce=qw-')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


// Create routes;
app.use(require('./routes/web'));

app.listen(3010, function () {
    console.log('running');
});

