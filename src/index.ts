import express, { Application, Response, Request } from "express";
import { ConnectionWithMongoDb } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
// Handle cors origin
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));

// Handle json as request
app.use(express.json());

// Handle url params like (space)
app.use(express.urlencoded({ extended: true }));

// Handle file upload
app.use(express.static("public"));

// Handle browser cookies for access
app.use(cookieParser());

// router
// app.use("/api", router);
app.use("/api/v1/user", userRouter);

// DB connections
ConnectionWithMongoDb()
  .then(() => {
    app.on("error", () => {
      console.log("SERVER NOT STARTED");
    });
    // App started
    app.listen(port, () => {
      console.log("SERVER STARTED AT PORT", port);
    });
  })
  .catch(() => {
    console.log("DATABASE NOT CONNECT WITH MONGODB");
  });

export { app };
