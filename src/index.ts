import express, { Application, Response, Request } from "express";
import { ConnectionWithMongoDb } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// Middlewares
app.use(
  cors({
    credentials: true,
  })
);

// DB connections
ConnectionWithMongoDb();

// App started
app.listen(port, () => {
  console.log("server started!");
});
