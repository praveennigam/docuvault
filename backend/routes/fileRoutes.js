import express from "express";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload files
router.post("/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: "No files uploaded" });

  const uploadedFiles = req.files.map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
  }));

  res.status(200).json(uploadedFiles);
});

export default router;





