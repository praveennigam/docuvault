import express from "express";
import {
  registerUser,
  getAllUsers,
  getRoleFields,
  loginUser,
  getUserById,
  updateUserFields,
  uploadFieldFile,
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🔹 REGISTER & LOGIN */
/* -------------------------------------------------------------------------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* -------------------------------------------------------------------------- */
/* 🔹 USERS FETCH / UPDATE */
/* -------------------------------------------------------------------------- */
router.get("/", getAllUsers);
router.get("/role/:roleId", getRoleFields);
router.get("/:id", getUserById);
router.put("/:id", updateUserFields);

/* -------------------------------------------------------------------------- */
/* 🔹 FILE UPLOAD (Aadhaar, PAN, etc.) */
/* -------------------------------------------------------------------------- */
router.post("/upload", upload.single("file"), uploadFieldFile);

/* -------------------------------------------------------------------------- */
/* 🔹 ALTERNATIVE ENDPOINT (upload by type, stores file properly in /uploads) */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 🔹 ALTERNATIVE ENDPOINT (upload by type, stores file properly in /uploads) */
/* -------------------------------------------------------------------------- */
router.post("/upload/:type/:userId", upload.single("file"), async (req, res) => {
  try {
    const { type, userId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // ✅ Ensure uploads/userId folder exists
    const userFolder = path.join("uploads", userId);
    fs.mkdirSync(userFolder, { recursive: true });

    // ✅ Move uploaded file into the user folder
    const newPath = path.join(userFolder, file.filename);
    fs.renameSync(file.path, newPath);

    // ✅ File URL (to serve in frontend)
    const fileUrl = `/uploads/${userId}/${file.filename}`;
    const fileType = file.mimetype.includes("pdf") ? "pdf" : "image";

    // ✅ Update user in DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Update the correct requiredField by `type`
    user.requiredFields = user.requiredFields.map((f) => {
      if (f.type === type) {
        // Push new upload entry in `uploads` array
        f.uploads.push({
          fileName: file.filename,
          fileType,
          filePath: fileUrl,
          uploadedAt: new Date(),
        });
      }
      return f;
    });

    await user.save();

    res.json({
      message: `✅ ${type} uploaded successfully!`,
      fileUrl,
      updatedFields: user.requiredFields,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🔹 UPDATE PASSWORD */
/* -------------------------------------------------------------------------- */
router.put("/:id/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "✅ Password updated successfully!" });
  } catch (err) {
    console.error("Password Update Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
