import Document from "../models/Document.js";

// ✅ Create a document
export const createDocument = async (req, res) => {
  try {
    const { category, type, fields } = req.body; // include category
    if (!category || !type || !fields || fields.length === 0) {
      return res.status(400).json({ message: "Category, type, and fields are required" });
    }

    const doc = new Document({ category, type, fields });
    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    console.error("❌ Create document error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all documents
export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.status(200).json(docs);
  } catch (err) {
    console.error("❌ Get documents error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a document by ID
export const deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Document not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete document error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
