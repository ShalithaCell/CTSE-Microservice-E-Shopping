import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import { initRoutes } from './routes'
const healthCheck = require('express-healthcheck');

import { MONGO_URI } from "./shared/config/mongodb";

export default class Init {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.connectToDatabase();
    this.initializeMiddleware();
    this.app.use("/", initRoutes())
  }

  private healthyIntercept(req, res, next){
    next();
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  /*
   *Run application on port 8080
   */
  public listen() {
    this.app.use('/healthcheck', this.healthyIntercept, healthCheck());
    this.app.listen(4000, () => {
      console.log(`Connected to 4000`);
    });
  }

  /*
   *Initialize connection with mongo DB
   */
  private connectToDatabase() {
    mongoose
      .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MDB connected"))
      .catch(error => error);
  }
}
