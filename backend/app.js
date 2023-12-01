const express = require('express');

// error handlers
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// import routes
const userRoutes = require('./routes/userRoutes');
const toDoRoutes = require('./routes/toDoRoutes');

const app = express();

// JSON middleware
app.use(express.json());

// implement routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todo', toDoRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
