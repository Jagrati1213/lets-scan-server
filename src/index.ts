import express, { Application, Response, Request } from "express";
import { ConnectionWithMongoDb } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes/user-route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// Middlewares
// Handle cors origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Handle json as request
app.use(express.json());

// Handle url params like (space)
app.use(express.urlencoded({ extended: true }));

// Handle file upload
app.use(express.static("public"));

app.use(cookieParser());

// router
app.use("/api", router);

// DB connections
ConnectionWithMongoDb()
  .then(() => {
    // App started
    app.listen(port, () => {
      console.log("server started!");
    });
  })
  .catch(() => {
    console.log("Mongoose not connected");
  });

export { app };
