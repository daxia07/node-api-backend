// FileName: index.js
// Import express
require('dotenv').config()
const express = require('express')
// Initialize the app
const app = express()
// Import routes
const apiRoutes = require('./api-routes')
const mongoose = require('mongoose')

// Setup server port
const port = process.env.PORT || 8080
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }))

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {}, err => console.log(err))
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Use Api routes in the App
app.use('/api', apiRoutes)

// Launch app to listen to specified port
app.listen(port, function () {
    console.log('Running API Server on port ' + port);
})