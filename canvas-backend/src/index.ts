import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import auth_router from "./routes/auth.js";
import room_router from "./routes/room.js";
import chats_router from "./routes/chats.js";
import generate_router from "./routes/generate.js";
import { authMiddleware } from "./middleware/auth.js";
import type { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

//CORS Configuration

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate Limiters

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many AI requests, please wait." },
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use(globalLimiter);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", auth_router);

app.use("/api/room", authMiddleware, room_router);
app.use("/api/chats", authMiddleware, chats_router);

app.use("/api/generate", authMiddleware, aiLimiter, generate_router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err);

  // Specific Error Handling
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ message: "Invalid JSON payload" });
    return;
  }
  
  if (err.name === "UnauthorizedError" || err.message === "Not allowed by CORS") {
    res.status(401).json({ message: err.message });
    return;
  }

  // Generic Fallback
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
});

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.BIND_ADDRESS || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`🛡️  Allowed Origins: ${allowedOrigins.join(", ")}`);
});
