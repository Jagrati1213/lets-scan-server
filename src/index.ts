import express, { Application } from "express";
import { ConnectionWithMongoDb } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { vendorRouter } from "./routes/vendor.route";
import { menuRouter } from "./routes/menu.route";
import { letScanRouter } from "./routes/letScan.route";
import { orderRouter } from "./routes/order.route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;

// Middlewares
// Handle cors origin
    const corsOptions = {
        origin: '*', // Specify the allowed origin(s)
        methods: ['*'], // Allowed HTTP methods
        // allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
        credentials: true // Allow cookies or other credentials
    };
   app.use(cors(corsOptions));
// app.use(cors());
// app.use(cors({
//   origin: [
//     "http://localhost:3000", // your local frontend
//     "https://lets-scan-dashboard.vercel.app" // deployed frontend domain (change if different)
//   ],
//   credentials: true, // allow cookies to be sent
// }));
// app.options("*", cors({
//   origin: [
//     "http://localhost:3000",
//     "https://lets-scan-dashboard.vercel.app",
//     "*"
//   ],
//   credentials: true,
// }));


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
