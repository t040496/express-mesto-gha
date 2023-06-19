const express = require('express');
const mongoose = require('mongoose');
const rootRouter = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());

// mock for authorization
app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('648ec3c1b07a6c5fef4d319a'),
  };
  next();
});

app.use(rootRouter);

app.listen(3000, () => {});
