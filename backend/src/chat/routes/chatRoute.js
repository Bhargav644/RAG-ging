import express from "express";
import { chatWithDoc } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithDoc);

export default router;
