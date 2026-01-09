import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import routes from "./Routes";
import  dotenv  from "dotenv";

dotenv.config();
const MONGO = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

class App {
  constructor() {
    this.server = express();

    this.database();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  database() {
    mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true, dbName: MONGO_DB })
    .then(()=> {
      console.log('Mongo connected');
    })
    .catch(err => {
      console.error('Mongo connection error', err);
    });
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;