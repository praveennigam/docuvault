import express from "express";
import {
  createOrUpdateReferenceDocument,
  getReferenceDocumentsByCategory,
  getAllReferenceDocuments,
  cloneReferenceDocument,
} from "../controllers/referenceDocumentController.js";

const router = express.Router();

router.post("/create-or-update", createOrUpdateReferenceDocument);
router.get("/category/:category", getReferenceDocumentsByCategory);
router.get("/", getAllReferenceDocuments);
router.get("/clone/:id", cloneReferenceDocument);

export default router;
