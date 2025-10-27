import express from "express";
import multer from "multer";
import {
  createProtocol,
  getAllProtocols,
  getProtocolById,
  updateProtocol,
  deleteProtocol,
  addDescription,
  uploadDocuments,
} from "../controllers/protocolController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD
router.post("/", createProtocol);
router.get("/", getAllProtocols);
router.get("/:id", getProtocolById);
router.put("/:id", updateProtocol);
router.delete("/:id", deleteProtocol);

// Description
router.post("/add-description/:protocolId/:stepIndex", addDescription);

// Upload files for step
router.post("/upload/:protocolId/:stepIndex", upload.array("files"), uploadDocuments);

// Get all protocol documents
router.get("/documents/:protocolId", async (req, res) => {
  try {
    const Protocol = await import("../models/Protocol.js").then((m) => m.default);
    const protocol = await Protocol.findById(req.params.protocolId);
    if (!protocol) return res.status(404).json({ message: "Protocol not found" });

    const documents = protocol.allDocuments.map((f) => ({
      filename: f,
      url: `${req.protocol}://${req.get("host")}/uploads/${f}`,
    }));
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
