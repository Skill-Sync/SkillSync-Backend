const express = require('express');
const morgan = require('morgan');
const path = require('path');
//--------------------------------//
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
//--------------------------------//
// Main Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});
//--------------------------------//
// Error Handling Middleware

//--------------------------------//
module.exports = app;
