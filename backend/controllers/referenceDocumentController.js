import ReferenceDocument from "../models/ReferenceDocument.js";
import Document from "../models/Document.js";
import Protocol from "../models/Protocol.js";
import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/* ✅ CREATE or UPDATE ReferenceDocument */
/* -------------------------------------------------------------------------- */
export const createOrUpdateReferenceDocument = async (req, res) => {
  try {
    const { category, label, selectedDocs, conditions, protocols } = req.body;

    if (!selectedDocs || selectedDocs.length === 0)
      return res.status(400).json({ message: "No documents selected" });

    // ✅ Convert protocols safely
    const protocolIds = Array.isArray(protocols)
      ? protocols.filter(Boolean).map((id) => new mongoose.Types.ObjectId(id))
      : [];

    // ✅ Validate all selected documents exist
    for (const d of selectedDocs) {
      const docId = d.document._id || d.document;
      if (!mongoose.Types.ObjectId.isValid(docId))
        return res.status(400).json({ message: `Invalid Document ID: ${docId}` });

      const docExists = await Document.findById(docId);
      if (!docExists)
        return res.status(400).json({ message: `Document not found: ${docId}` });
    }

    // ✅ Validate protocols
    if (protocolIds.length > 0) {
      const validProtocols = await Protocol.find({ _id: { $in: protocolIds } });
      if (validProtocols.length !== protocolIds.length)
        return res.status(400).json({ message: "Invalid protocol(s) found" });
    }

    // ✅ Check existing document
    let refDoc = await ReferenceDocument.findOne({ category, label });

    if (refDoc) {
      // --- UPDATE EXISTING ---
      const existingIds = refDoc.documents.map((d) => d.document.toString());

      selectedDocs.forEach((d) => {
        const docId = d.document._id || d.document;
        if (!existingIds.includes(docId.toString())) {
          refDoc.documents.push({
            document: new mongoose.Types.ObjectId(docId),
            requiredFields: d.fields || [],
          });
        }
      });

      refDoc.conditions = conditions || [];
      refDoc.protocols = protocolIds;

      await refDoc.save();
      await refDoc.populate(["documents.document", "protocols"]);

      return res.status(200).json({
        message: "Reference Document updated successfully",
        refDoc,
      });
    }

    // --- CREATE NEW ---
    refDoc = new ReferenceDocument({
      label,
      category,
      documents: selectedDocs.map((d) => ({
        document: new mongoose.Types.ObjectId(d.document._id || d.document),
        requiredFields: d.fields || [],
      })),
      conditions: conditions || [],
      protocols: protocolIds,
    });

    await refDoc.save();
    await refDoc.populate(["documents.document", "protocols"]);

    res.status(201).json({
      message: "Reference Document created successfully",
      refDoc,
    });
  } catch (err) {
    console.error("❌ Error saving reference document:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET ReferenceDocuments by Category */
/* -------------------------------------------------------------------------- */
export const getReferenceDocumentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const refDocs = await ReferenceDocument.find({ category }).populate([
      { path: "documents.document", select: "type fields" },
      { path: "protocols" },
    ]);
    res.status(200).json(refDocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET ALL ReferenceDocuments */
/* -------------------------------------------------------------------------- */
export const getAllReferenceDocuments = async (req, res) => {
  try {
    const refDocs = await ReferenceDocument.find().populate([
      { path: "documents.document", select: "type fields" },
      { path: "protocols" },
    ]);
    res.status(200).json(refDocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ CLONE ReferenceDocument (for Prefill Form) */
/* -------------------------------------------------------------------------- */
export const cloneReferenceDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // 🧩 Populate with full document + field data
    const refDoc = await ReferenceDocument.findById(id).populate([
      { path: "documents.document", select: "type fields" },
      { path: "protocols" },
    ]);

    if (!refDoc)
      return res.status(404).json({ message: "Reference Document not found" });

    // ✅ Construct clone data for frontend prefill
    const clonedData = {
      label: `${refDoc.label} (Clone)`,
      category: refDoc.category,
      documents: refDoc.documents.map((d) => ({
        document: d.document, // includes type + fields
        requiredFields: d.requiredFields || [],
      })),
      conditions: Array.isArray(refDoc.conditions)
        ? [...refDoc.conditions]
        : [],
      protocols: refDoc.protocols || [],
    };

    res.status(200).json(clonedData);
  } catch (err) {
    console.error("❌ Error cloning reference document:", err);
    res.status(500).json({ message: err.message });
  }
};
