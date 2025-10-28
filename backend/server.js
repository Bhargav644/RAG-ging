import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 3000;

// Use dynamic import to ensure dotenv loads before app
const spinServer = async () => {
  try {
    const { default: app } = await import("./src/app.js");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

spinServer();
