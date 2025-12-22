import express from "express";
import uploadFile from "../controllers/uploadController.js";
import upload from "../../config/multerStorage.js";

const router = express.Router();

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: "File too large. Maximum size is 50MB."
        });
      }
      return res.status(400).json({
        message: err.message || "File upload error"
      });
    }
    next();
  });
}, uploadFile);

export default router;
