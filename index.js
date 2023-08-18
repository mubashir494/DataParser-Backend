import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import data from "./routes/data.js";
import sql from "mssql";
import dotenv from "dotenv";
import sqlConfig from "./configuration/sqlConfig.js";

const PORT = 3000;
const app = express();

// Configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
const appPool = new sql.ConnectionPool(sqlConfig);

// Routes
app.use("/data", data);

appPool
  .connect()
  .then(function (pool) {
    console.log("Successfully Connected to remote MS SQL server")
    app.locals.db = pool;
    const server = app.listen(3000, function () {
      const host = server.address().address;
      const port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  })
  .catch(function (err) {
    console.error("Error creating connection pool", err.message);
    const server = app.listen(3000, function () {
      const host = server.address().address;
      const port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  });
