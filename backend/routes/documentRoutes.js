import express from "express";
import { createDocument, getDocuments, deleteDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post("/", createDocument);
router.get("/", getDocuments);
router.delete("/:id", deleteDocument);

export default router;
