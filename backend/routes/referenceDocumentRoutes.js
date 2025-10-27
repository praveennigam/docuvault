import express from "express";
import {
  createOrUpdateReferenceDocument,
  getReferenceDocumentsByCategory,
  getAllReferenceDocuments,
  cloneReferenceDocument,
} from "../controllers/referenceDocumentController.js";

const router = express.Router();

// Create or Update ReferenceDocument
router.post("/create-or-update", createOrUpdateReferenceDocument);

// Get ReferenceDocuments by category
router.get("/:category", getReferenceDocumentsByCategory);

// Get all ReferenceDocuments
router.get("/", getAllReferenceDocuments);

// Clone a reference document
router.post("/clone/:id", cloneReferenceDocument);

export default router;
