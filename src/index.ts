import express, { Application } from "express";
import { ConnectionWithMongoDb } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { vendorRouter } from "./routes/vendor.route";
import { menuRouter } from "./routes/menu.route";
import { letScanRouter } from "./routes/letScan.route";
import { orderRouter } from "./routes/order.route";
import { paymentRouter } from "./routes/payement.route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;

// Middlewares
// Handle cors origin
app.use(cors({ credentials: true, origin: "*" }));
// app.use(cors());

// Handle json as request
app.use(express.json());

// Handle url params like (space)
app.use(express.urlencoded({ extended: true }));

// Handle file upload
app.use(express.static("public"));

// Handle browser cookies for access
app.use(cookieParser());

// router
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/lets-scan", letScanRouter);
app.use("/api/v1/order", orderRouter);
app.use("api/v1/payment", paymentRouter);

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
