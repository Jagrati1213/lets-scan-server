import express, { Application, Response, Request } from "express";

const app: Application = express();
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log("server started at Port:", PORT);
});
