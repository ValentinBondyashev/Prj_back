// Initialize express;
const express = require('express');
const app = express();

// Initialize firebase;
const firebase = require('firebase-admin');
firebase.initializeApp({
    credential: firebase.credential.cert(require('./service-account-key.json'))
});

// Configure app for use body-parser;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json());

// Initialize database;
global.Sequelize = require('sequelize');
global.sequelize = new Sequelize('mysql://avadak00_skills:cjxr8b38@avadak00.mysql.tools:3306/avadak00_skills');

// Create routes;
app.use(require('./routes'));

// Return api routes;
module.exports = app;
