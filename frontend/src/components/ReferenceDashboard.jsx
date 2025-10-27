// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReferenceDocumentForm from "./ReferenceDocumentForm";
// import ReferenceDocumentList from "./ReferenceDocumentList";
// import "./ReferenceDashboard.css";

// export default function ReferenceDashboard() {
//   const [category, setCategory] = useState("");
//   const [documents, setDocuments] = useState([]);
//   const [allRefDocs, setAllRefDocs] = useState([]);
//   const [selectedDocs, setSelectedDocs] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/api/documents")
//       .then((res) => setDocuments(res.data))
//       .catch((err) => console.error(err));

//     fetchAllRefDocs();
//   }, []);

//   const fetchAllRefDocs = async () => {
//     try {
//       const res = await axios.get("/api/reference-documents");
//       setAllRefDocs(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       for (const docObj of selectedDocs) {
//         const payload = {
//           category,
//           document: docObj.document._id,
//           requiredFields: docObj.fields.map((f) => ({ key: f.key, label: f.label })),
//           conditions: docObj.conditions || [],
//         };
//         await axios.post("/api/reference-documents/create-or-update", payload);
//       }

//       alert("✅ Reference document(s) saved successfully!");
//       setSelectedDocs([]);
//       setCategory("");
//       fetchAllRefDocs();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error saving reference document(s)");
//     }
//   };

//   const handleClone = async (id) => {
//     try {
//       const res = await axios.post(`/api/reference-documents/clone/${id}`);
//       setSelectedDocs([res.data]);
//       setCategory(res.data.category);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="reference-dashboard">
//       <h2>📘 Reference Documents Manager</h2>

//       <ReferenceDocumentForm
//         category={category}
//         setCategory={setCategory}
//         documents={documents}
//         selectedDocs={selectedDocs}
//         setSelectedDocs={setSelectedDocs}
//         onSave={handleSave}
//       />

//       {/* Correct component name */}
//       <ReferenceDocumentList
//         category={category}
//         refDocs={allRefDocs}
//         onClone={handleClone}
//       />
//     </div>
//   );
// }


// // frontend/src/components/ReferenceDashboard.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReferenceDocumentForm from "./ReferenceDocumentForm";
// import ReferenceDocumentList from "./ReferenceDocumentList";
// import "./ReferenceDashboard.css";

// export default function ReferenceDashboard() {
//   const [category, setCategory] = useState("");
//   const [documents, setDocuments] = useState([]);
//   const [selectedDocs, setSelectedDocs] = useState([]);
//   const [clonedDoc, setClonedDoc] = useState(null);
//   const [allRefDocs, setAllRefDocs] = useState([]);

//   // Load available base documents + reference docs
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [docsRes, refRes] = await Promise.all([
//           axios.get("/api/documents"),
//           axios.get("/api/reference-documents"),
//         ]);
//         setDocuments(docsRes.data);
//         setAllRefDocs(refRes.data);
//       } catch (err) {
//         console.error("❌ Error loading data:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   const fetchAllRefDocs = async () => {
//     try {
//       const res = await axios.get("/api/reference-documents");
//       setAllRefDocs(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Unified Save handler (aligned with backend)
//   const handleSave = async ({ label, category, selectedDocs, conditions }) => {
//     try {
//       console.log("📤 Saving Reference Document:", { label, category, selectedDocs, conditions });
//       const _res = await axios.post("/api/reference-documents/create-or-update", {
//         label,
//         category,
//         selectedDocs,
//         conditions,
//       });
//       alert("✅ Saved successfully!");
//       setSelectedDocs([]);
//       setCategory("");
//       setClonedDoc(null);
//       fetchAllRefDocs();
//     } catch (err) {
//       console.error("❌ Save Error:", err.response?.data || err.message);
//       alert("❌ Error saving document. Check console.");
//     }
//   };

//   // ✅ Clone existing reference doc into form
//   const handleClone = async (id) => {
//     try {
//       const res = await axios.post(`/api/reference-documents/clone/${id}`);
//       setClonedDoc(res.data);
//       setCategory(res.data.category);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="reference-dashboard">
//       <h2>📘 Reference Documents/Sop</h2>

//       <ReferenceDocumentForm
//         category={category}
//         setCategory={setCategory}
//         documents={documents}
//         selectedDocs={selectedDocs}
//         setSelectedDocs={setSelectedDocs}
//         onSave={handleSave}
//         clonedDoc={clonedDoc}
//       />

//       <ReferenceDocumentList
//         category={category}
//         refDocs={allRefDocs}
//         onClone={handleClone}
//       />
//     </div>
//   );
// }



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
  const [selectedProtocols, setSelectedProtocols] = useState([]); // ✅ New state

  // Load base documents + reference docs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, refRes] = await Promise.all([
          axios.get("/api/documents"),
          axios.get("/api/reference-documents"),
        ]);
        setDocuments(docsRes.data);
        setAllRefDocs(refRes.data);
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

  // Save handler with protocols
  const handleSave = async ({ label, category, selectedDocs, conditions, protocols }) => {
    try {
      console.log("📤 Saving Reference Document:", { label, category, selectedDocs, conditions, protocols });
      const _res = await axios.post("/api/reference-documents/create-or-update", {
        label,
        category,
        selectedDocs,
        conditions,
        protocols: protocols || [], // ✅ ensure protocols are sent
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

  // Clone existing reference doc
  const handleClone = async (id) => {
    try {
      const res = await axios.post(`/api/reference-documents/clone/${id}`);
      const doc = res.data;
      setClonedDoc(doc);
      setCategory(doc.category);
      setSelectedProtocols(doc.protocols?.map((p) => p._id) || []); // ✅ Populate protocols
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reference-dashboard">
      <h2>📘 Reference Documents/SOP</h2>

     
     <ReferenceDocumentForm
  category={category}
  setCategory={setCategory}
  documents={documents}
  selectedDocs={selectedDocs}
  setSelectedDocs={setSelectedDocs}
  selectedProtocols={selectedProtocols}          // ✅ pass it
  setSelectedProtocols={setSelectedProtocols}    // ✅ pass it
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
