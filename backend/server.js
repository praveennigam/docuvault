import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import documentRoutes from "./routes/documentRoutes.js";
import referenceRoutes from "./routes/referenceDocumentRoutes.js";
import protocolRoutes from "./routes/protocolRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 🖼️ Static uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🌐 MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err.message));

// 🧩 Routes
app.get("/", (req, res) => res.send("DocuVault API running 🚀"));
app.use("/api/files", fileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reference-documents", referenceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/protocols", protocolRoutes);

// 🚫 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
