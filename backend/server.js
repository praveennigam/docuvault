import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import referenceRoutes from "./routes/referenceDocumentRoutes.js"
import protocolRoutes from "./routes/protocolRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import path from "path";
import userRoutes from "./routes/userRoutes.js";

import bcrypt from "bcryptjs";


dotenv.config();

const app = express();

// ✅ Logging middleware (before routes)
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ✅ Enable CORS for all origins
app.use(cors({ origin: true, credentials: true }));

// ✅ Parse JSON
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err.message));

// ✅ Test route
app.get("/", (req, res) => res.send("DocuVault API running 🚀"));


  app.use("/api/files", fileRoutes); 

// ✅ Document routes
app.use("/api/documents", documentRoutes);


// ReferenceDocument routes
app.use("/api/reference-documents", referenceRoutes);


//user
app.use("/api/users", userRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


//PROTOCOL API
app.use("/api/protocols", protocolRoutes); 

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
