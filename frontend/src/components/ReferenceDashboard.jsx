import { useState, useEffect } from "react";
import axios from "axios";
import ReferenceDocumentForm from "./ReferenceDocumentForm";
import ReferenceDocumentList from "./ReferenceDocumentList";
import "./ReferenceDashboard.css";

export default function ReferenceDashboard() {
  const [category, setCategory] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [clonedDoc, setClonedDoc] = useState(null);
  const [allRefDocs, setAllRefDocs] = useState([]);
  const [selectedProtocols, setSelectedProtocols] = useState([]);

  // ✅ Fetch all documents + reference docs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, refRes] = await Promise.all([
          axios.get("/api/documents"),
          axios.get("/api/reference-documents"),
        ]);
        setDocuments(docsRes.data || []);
        setAllRefDocs(refRes.data || []);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  const fetchAllRefDocs = async () => {
    try {
      const res = await axios.get("/api/reference-documents");
      setAllRefDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Save handler
  const handleSave = async ({ label, category, selectedDocs, conditions, protocols }) => {
    try {
      console.log("📤 Saving Reference Document:", { label, category, selectedDocs, conditions, protocols });
      await axios.post("/api/reference-documents/create-or-update", {
        label,
        category,
        selectedDocs,
        conditions,
        protocols,
      });
      alert("✅ Saved successfully!");
      setSelectedDocs([]);
      setSelectedProtocols([]);
      setCategory("");
      setClonedDoc(null);
      fetchAllRefDocs();
    } catch (err) {
      console.error("❌ Save Error:", err.response?.data || err.message);
      alert("❌ Error saving document. Check console.");
    }
  };

  // ✅ Clone existing reference doc
  const handleClone = async (id) => {
    try {
      const res = await axios.get(`/api/reference-documents/clone/${id}`);
      const doc = res.data;

      console.log("🧩 Cloning document:", doc);

      if (!doc || !doc.documents?.length) {
        console.warn("⚠️ No documents found in cloned doc:", doc);
        return;
      }

      setClonedDoc(doc);
      setCategory(doc.category);
      setSelectedProtocols(doc.protocols?.map((p) => p._id) || []);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ Clone error:", err);
    }
  };

  return (
    <div className="reference-dashboard">
      <h2 className="dashboard-title">📘 SOP Management</h2>

      <ReferenceDocumentForm
        category={category}
        setCategory={setCategory}
        documents={documents}
        selectedDocs={selectedDocs}
        setSelectedDocs={setSelectedDocs}
        selectedProtocols={selectedProtocols}
        setSelectedProtocols={setSelectedProtocols}
        onSave={handleSave}
        clonedDoc={clonedDoc}
      />

      <ReferenceDocumentList
        category={category}
        refDocs={allRefDocs}
        onClone={handleClone}
      />
    </div>
  );
}
