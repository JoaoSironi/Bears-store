const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const registerRoutes = require('./Routes');

const app = express();
app.use(cors());
app.use(express.json());

registerRoutes(app);

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true, dbName: MONGO_DB })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log('Server running on', PORT));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });