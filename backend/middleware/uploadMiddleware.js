import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Create uploads folder if not exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = `${base}_${Date.now()}${ext}`;
    cb(null, unique);
  },
});

// ✅ File type filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and PDFs allowed!"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;
