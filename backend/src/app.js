import express from "express";
import cors from "cors";
import uploadRoutes from "./upload/routes/uploadRoute.js";
import chatRoutes from "./chat/routes/chatRoute.js";
import healthRoute from "./health/healthRoute.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoute);
app.use("/rag", uploadRoutes, chatRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
