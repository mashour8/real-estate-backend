import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CLINET_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("server is running on 8800");
});
