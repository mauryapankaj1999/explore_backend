import createError from "http-errors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { CONFIG } from "./common/config.common";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import v1Router from "v1/router.v1";
import { seedData } from "seeder/seeder";

const app = express();

/**
 * @description Swagger/OpenAi Config
 */

/**
 * @description mongo connection and seeder
 */

mongoose
  .connect(CONFIG.MONGOURI)
  .then(() => console.log("DB Connected to ", CONFIG.MONGOURI))
  .catch((err) => console.error(err));

mongoose.set("debug", true);
mongoose.set("allowDiskUse", true);

seedData();

/**
 *@description express configuration
 */

app.use(cors());
app.set("trust proxy", true);

// app.use(setUserAndUserObj);
app.use(logger("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: false, limit: "500mb" }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

/**
 * v1 Router
 */

app.use("/v1", v1Router);

/**
 * 404 error handler
 */

app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * general error handler
 */

app.use(errorHandler);

export default app;
