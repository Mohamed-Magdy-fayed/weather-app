// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
// Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cors for cross origin allowance
const cors = require('cors');

app.use(cors());

// Initialize the main project folder
app.use(express.static('public'));

// Initialize all route with a callback function
// Callback function to complete GET '/data'
const getData = (req, res) => res.send(projectData);

// get rout
app.get('/data', getData)

// Callback function to complete POST '/add'
const postData = (req, res) => {
    projectData = req.body;
    res.send(projectData)
}

// Post Route
app.post('/add', postData)

// Spin up the server
const port = 3030;

// Callback to debug
app.listen(port, ()=> {
    console.log(`server runnig on port ${port}`);
})