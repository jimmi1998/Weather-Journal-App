/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
/**
* @description Connecting Express, Middleware and other dependences.
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const opn = require('opn');

/**
* @description Setup empty JS array to act as endpoint for all routes.
*/
let projectData = [];

/**
* @description Start up an instance of app.
*/
const app = express();

/* Middleware*/
/**
* @description Here we are configuring express to use body-parser as middle-ware.
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
* @description Connecting Cors for cross origin allowance.
*/
app.use(cors());

/**
* @description Initialize the main project folder.
*/
app.use(express.static('website'));

/**
* @description Setup Server.
*/
const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log('*************************************');
    console.log(' Server started Successfully!');
    console.log(` Running on - http://localhost:${port}'`);
    console.log('=====================================');
    console.log(' To stop the server, Press - Ctrl+C');
    console.log('*************************************');
}

/**
* @description Send projectData.
*/
app.get('/get', function (request, response) {
    response.send(projectData);
});

/**
* @description Add a new entry to projectData.
*/
app.post('/set', function (request, response) {
    projectData = request.body;
});

/**
* @description Add a new variant projectData.
*/
app.post('/update', function (request, response) {
    projectData = [];
    projectData = request.body;
});

/**
* @description Opening the app in the browser.
*/
server ? opn(`http://localhost:${port}`) : null;
