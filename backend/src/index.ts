import express from "express";
import apiRouter from "./api.routes.js";
import { config } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use("/api", apiRouter);
app.use(errorMiddleware);
await connectDB();
try {
  
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
