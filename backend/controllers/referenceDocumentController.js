// import ReferenceDocument from "../models/ReferenceDocument.js";
// import Document from "../models/Document.js";

// // Create or Update ReferenceDocument (merge multiple documents into one)
// export const createOrUpdateReferenceDocument = async (req, res) => {
//   try {
//     const { category, label, selectedDocs, conditions } = req.body;

//     if (!selectedDocs || selectedDocs.length === 0)
//       return res.status(400).json({ message: "No documents selected" });

//     // Validate all documents exist
//     for (const d of selectedDocs) {
//       const docExists = await Document.findById(d.document._id || d.document);
//       if (!docExists) return res.status(400).json({ message: "Document not found" });
//     }

//     // Check if ReferenceDocument already exists for this category + label
//     let refDoc = await ReferenceDocument.findOne({ category, label });

//     if (refDoc) {
//       // Merge documents without duplicates
//       const existingIds = refDoc.documents.map(d => d.document.toString());
//       selectedDocs.forEach(d => {
//         const docId = d.document._id || d.document;
//         if (!existingIds.includes(docId.toString())) {
//           refDoc.documents.push({
//             document: docId,
//             requiredFields: d.fields,
//           });
//         }
//       });

//       // Update shared conditions
//       refDoc.conditions = conditions;

//       await refDoc.save();
//       await refDoc.populate("documents.document");
//       return res.status(200).json(refDoc);
//     }

//     // Create new ReferenceDocument
//     refDoc = new ReferenceDocument({
//       label,
//       category,
//       documents: selectedDocs.map(d => ({
//         document: d.document._id || d.document,
//         requiredFields: d.fields,
//       })),
//       conditions,
//     });

//     await refDoc.save();
//     await refDoc.populate("documents.document");
//     res.status(201).json(refDoc);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get ReferenceDocuments by category
// export const getReferenceDocumentsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const refDocs = await ReferenceDocument.find({ category }).populate("documents.document");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all ReferenceDocuments
// export const getAllReferenceDocuments = async (req, res) => {
//   try {
//     const refDocs = await ReferenceDocument.find().populate("documents.document");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Clone ReferenceDocument
// export const cloneReferenceDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const refDoc = await ReferenceDocument.findById(id);
//     if (!refDoc) return res.status(404).json({ message: "Reference Document not found" });

//     const cloned = new ReferenceDocument({
//       label: refDoc.label + " (Clone)",
//       category: refDoc.category,
//       documents: [...refDoc.documents],
//       conditions: refDoc.conditions ? [...refDoc.conditions] : [],
//     });

//     await cloned.save();
//     await cloned.populate("documents.document");
//     res.status(201).json(cloned);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


// import ReferenceDocument from "../models/ReferenceDocument.js";
// import Document from "../models/Document.js";
// import Protocol from "../models/Protocol.js";

// // Create or Update ReferenceDocument
// export const createOrUpdateReferenceDocument = async (req, res) => {
//   try {
//     const { category, label, selectedDocs, conditions, protocols } = req.body;

//     if (!selectedDocs || selectedDocs.length === 0)
//       return res.status(400).json({ message: "No documents selected" });

//     // ✅ Validate all documents exist
//     for (const d of selectedDocs) {
//       const docExists = await Document.findById(d.document._id || d.document);
//       if (!docExists) return res.status(400).json({ message: "Document not found" });
//     }

//     // ✅ Validate all protocols exist
//     if (protocols && protocols.length > 0) {
//       const validProtocols = await Protocol.find({ _id: { $in: protocols } });
//       if (validProtocols.length !== protocols.length)
//         return res.status(400).json({ message: "Invalid protocol(s) found" });
//     }

//     // ✅ Check if ReferenceDocument already exists
//     let refDoc = await ReferenceDocument.findOne({ category, label });

//     if (refDoc) {
//       // Merge new documents
//       const existingIds = refDoc.documents.map(d => d.document.toString());
//       selectedDocs.forEach(d => {
//         const docId = d.document._id || d.document;
//         if (!existingIds.includes(docId.toString())) {
//           refDoc.documents.push({
//             document: docId,
//             requiredFields: d.fields,
//           });
//         }
//       });

//       // Update conditions + protocols
//       refDoc.conditions = conditions;
//       refDoc.protocols = protocols || [];

//       await refDoc.save();
//       await refDoc.populate(["documents.document", "protocols"]);
//       return res.status(200).json(refDoc);
//     }

//     // ✅ Create new ReferenceDocument
//     refDoc = new ReferenceDocument({
//       label,
//       category,
//       documents: selectedDocs.map(d => ({
//         document: d.document._id || d.document,
//         requiredFields: d.fields,
//       })),
//       conditions,
//       protocols: protocols || [],
//     });

//     await refDoc.save();
//     await refDoc.populate(["documents.document", "protocols"]);
//     res.status(201).json(refDoc);

//   } catch (err) {
//     console.error("Error saving reference document:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get ReferenceDocuments by category
// export const getReferenceDocumentsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const refDocs = await ReferenceDocument.find({ category })
//       .populate("documents.document")
//       .populate("protocols");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all ReferenceDocuments
// export const getAllReferenceDocuments = async (req, res) => {
//   try {
//     const refDocs = await ReferenceDocument.find()
//       .populate("documents.document")
//       .populate("protocols");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Clone ReferenceDocument
// export const cloneReferenceDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const refDoc = await ReferenceDocument.findById(id);
//     if (!refDoc) return res.status(404).json({ message: "Reference Document not found" });

//     const cloned = new ReferenceDocument({
//       label: refDoc.label + " (Clone)",
//       category: refDoc.category,
//       documents: [...refDoc.documents],
//       conditions: refDoc.conditions ? [...refDoc.conditions] : [],
//       protocols: refDoc.protocols ? [...refDoc.protocols] : [],
//     });

//     await cloned.save();
//     await cloned.populate(["documents.document", "protocols"]);
//     res.status(201).json(cloned);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// import ReferenceDocument from "../models/ReferenceDocument.js";
// import Document from "../models/Document.js";
// import Protocol from "../models/Protocol.js";
// import mongoose from "mongoose";

// // ✅ Create or Update ReferenceDocument
// export const createOrUpdateReferenceDocument = async (req, res) => {
//   try {
//     const { category, label, selectedDocs, conditions, protocols } = req.body;

//     if (!selectedDocs || selectedDocs.length === 0)
//       return res.status(400).json({ message: "No documents selected" });

//     // ✅ Convert protocols to ObjectId safely
//     const protocolIds = Array.isArray(protocols)
//       ? protocols
//           .filter(Boolean)
//           .map((id) => new mongoose.Types.ObjectId(id))
//       : [];

//     // ✅ Validate all documents exist
//     for (const d of selectedDocs) {
//       const docExists = await Document.findById(d.document._id || d.document);
//       if (!docExists)
//         return res.status(400).json({ message: `Document not found: ${d.document}` });
//     }

//     // ✅ Validate all protocols exist (if any)
//     if (protocolIds.length > 0) {
//       const validProtocols = await Protocol.find({ _id: { $in: protocolIds } });
//       if (validProtocols.length !== protocolIds.length)
//         return res.status(400).json({ message: "Invalid protocol(s) found" });
//     }

//     // ✅ Check if ReferenceDocument already exists
//     let refDoc = await ReferenceDocument.findOne({ category, label });

//     if (refDoc) {
//       // --- UPDATE EXISTING ---
//       const existingIds = refDoc.documents.map((d) => d.document.toString());

//       selectedDocs.forEach((d) => {
//         const docId = d.document._id || d.document;
//         if (!existingIds.includes(docId.toString())) {
//           refDoc.documents.push({
//             document: docId,
//             requiredFields: d.fields,
//           });
//         }
//       });

//       refDoc.conditions = conditions || [];
//       refDoc.protocols = protocolIds; // ✅ store ObjectId versions
//       refDoc.markModified("protocols");

//       await refDoc.save();
//       await refDoc.populate(["documents.document", "protocols"]);

//       return res.status(200).json({
//         message: "Reference Document updated successfully",
//         refDoc,
//       });
//     }

//     // --- CREATE NEW ---
//     refDoc = new ReferenceDocument({
//       label,
//       category,
//       documents: selectedDocs.map((d) => ({
//         document: d.document._id || d.document,
//         requiredFields: d.fields,
//       })),
//       conditions: conditions || [],
//       protocols: protocolIds,
//     });

//     await refDoc.save();
//     await refDoc.populate(["documents.document", "protocols"]);

//     res.status(201).json({
//       message: "Reference Document created successfully",
//       refDoc,
//     });
//   } catch (err) {
//     console.error("Error saving reference document:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get ReferenceDocuments by category
// export const getReferenceDocumentsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const refDocs = await ReferenceDocument.find({ category })
//       .populate("documents.document")
//       .populate("protocols");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error("Error fetching by category:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get all ReferenceDocuments
// export const getAllReferenceDocuments = async (req, res) => {
//   try {
//     const refDocs = await ReferenceDocument.find()
//       .populate("documents.document")
//       .populate("protocols");
//     res.status(200).json(refDocs);
//   } catch (err) {
//     console.error("Error fetching reference documents:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Clone ReferenceDocument
// export const cloneReferenceDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const refDoc = await ReferenceDocument.findById(id)
//       .populate("documents.document")
//       .populate("protocols");

//     if (!refDoc)
//       return res.status(404).json({ message: "Reference Document not found" });

//     const cloned = new ReferenceDocument({
//       label: refDoc.label + " (Clone)",
//       category: refDoc.category,
//       documents: refDoc.documents.map((d) => ({
//         document: d.document._id,
//         requiredFields: d.requiredFields,
//       })),
//       conditions: refDoc.conditions ? [...refDoc.conditions] : [],
//       protocols: refDoc.protocols.map((p) => p._id),
//     });

//     await cloned.save();
//     await cloned.populate(["documents.document", "protocols"]);

//     res.status(201).json({
//       message: "Reference Document cloned successfully",
//       cloned,
//     });
//   } catch (err) {
//     console.error("Error cloning reference document:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

import ReferenceDocument from "../models/ReferenceDocument.js";
import Document from "../models/Document.js";
import Protocol from "../models/Protocol.js";
import mongoose from "mongoose";

// Create or Update ReferenceDocument
export const createOrUpdateReferenceDocument = async (req, res) => {
  try {
    const { category, label, selectedDocs, conditions, protocols } = req.body;

    if (!selectedDocs || selectedDocs.length === 0)
      return res.status(400).json({ message: "No documents selected" });

    // ✅ Convert protocols to ObjectId safely
    const protocolIds = Array.isArray(protocols)
      ? protocols.filter(Boolean).map((id) => new mongoose.Types.ObjectId(id))
      : [];

    // Validate all documents exist
    for (const d of selectedDocs) {
      const docId = d.document._id || d.document;
      if (!mongoose.Types.ObjectId.isValid(docId))
        return res.status(400).json({ message: `Invalid Document ID: ${docId}` });

      const docExists = await Document.findById(docId);
      if (!docExists)
        return res.status(400).json({ message: `Document not found: ${docId}` });
    }

    // Validate all protocols exist
    if (protocolIds.length > 0) {
      const validProtocols = await Protocol.find({ _id: { $in: protocolIds } });
      if (validProtocols.length !== protocolIds.length)
        return res.status(400).json({ message: "Invalid protocol(s) found" });
    }

    // Check if ReferenceDocument exists
    let refDoc = await ReferenceDocument.findOne({ category, label });

    if (refDoc) {
      // --- UPDATE EXISTING ---
      const existingIds = refDoc.documents.map((d) => d.document.toString());

      selectedDocs.forEach((d) => {
        const docId = d.document._id || d.document;
        if (!existingIds.includes(docId.toString())) {
          refDoc.documents.push({
            document: new mongoose.Types.ObjectId(docId),
            requiredFields: d.fields,
          });
        }
      });

      // Update conditions and protocols
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
        requiredFields: d.fields,
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
    console.error("Error saving reference document:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get ReferenceDocuments by category
export const getReferenceDocumentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const refDocs = await ReferenceDocument.find({ category }).populate([
      "documents.document",
      "protocols",
    ]);
    res.status(200).json(refDocs);
  } catch (err) {
    console.error("Error fetching by category:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all ReferenceDocuments
export const getAllReferenceDocuments = async (req, res) => {
  try {
    const refDocs = await ReferenceDocument.find().populate([
      "documents.document",
      "protocols",
    ]);
    res.status(200).json(refDocs);
  } catch (err) {
    console.error("Error fetching reference documents:", err);
    res.status(500).json({ message: err.message });
  }
};

// Clone ReferenceDocument
export const cloneReferenceDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const refDoc = await ReferenceDocument.findById(id).populate([
      "documents.document",
      "protocols",
    ]);

    if (!refDoc)
      return res.status(404).json({ message: "Reference Document not found" });

    const cloned = new ReferenceDocument({
      label: refDoc.label + " (Clone)",
      category: refDoc.category,
      documents: refDoc.documents.map((d) => ({
        document: new mongoose.Types.ObjectId(d.document._id),
        requiredFields: d.requiredFields,
      })),
      conditions: refDoc.conditions ? [...refDoc.conditions] : [],
      protocols: refDoc.protocols.map((p) => new mongoose.Types.ObjectId(p._id)),
    });

    await cloned.save();
    await cloned.populate(["documents.document", "protocols"]);

    res.status(201).json({
      message: "Reference Document cloned successfully",
      cloned,
    });
  } catch (err) {
    console.error("Error cloning reference document:", err);
    res.status(500).json({ message: err.message });
  }
};
