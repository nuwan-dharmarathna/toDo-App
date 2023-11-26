const express = require('express');

// import routes
const userRoutes = require('./routes/userRoutes');
const toDoRoutes = require('./routes/toDoRoutes');

const app = express();

// JSON middleware
app.use(express.json());

// implement routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todo', toDoRoutes);

module.exports = app;
