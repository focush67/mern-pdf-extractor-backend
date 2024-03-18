import express from "express";
import cors from "cors";
import ApiRouter from "./routes/api/route";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { corsOptions } from "./utilities/cors-options";

config();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, response) => {
  console.log("Home page accessed");
  return response.json({
    message: "Home Page accessed",
    status: 201,
  });
});

app.use("/api", ApiRouter);
app.use("/files", express.static("files"));
app.options("*", cors(corsOptions));

app.listen(4000, () => {
  console.log("Server running at port 4000");
});
