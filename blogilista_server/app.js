const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);

const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected to mongo db successfully');
  })
  .catch((error) => {
    console.log('connection error: ', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorHandler);
module.exports = app;
