import express from "express";

export const paymentRouter = express.Router();

paymentRouter.get("/", (req, res) => {
  return res.send("hi");
});
