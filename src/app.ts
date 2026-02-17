import express, { type Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morganMiddleware from "./logger/morgan.logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app: Application = express();

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ limit: "10kb", extended: true }));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(limiter);
app.use(morganMiddleware);

// Routes
import { videoRouter } from "./routes/video.routes.js";

app.use("/api/v1/video", videoRouter);



app.use(errorHandler);
export default app;
