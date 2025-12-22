import express from "express";
import cors from "cors";
import uploadRoutes from "./upload/routes/uploadRoute.js";
import chatRoutes from "./chat/routes/chatRoute.js";
import healthRoute from "./health/healthRoute.js";

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoute);
app.use("/rag", uploadRoutes, chatRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
