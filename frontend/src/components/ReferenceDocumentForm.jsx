// // frontend/src/components/ReferenceDocumentForm.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./ReferenceDocumentForm.css";

// export default function ReferenceDocumentForm({
//   category,
//   setCategory,
//   documents,
//   selectedDocs,
//   setSelectedDocs,
//   onSave,
//   clonedDoc,
// }) {
//   const [label, setLabel] = useState("");
//   const [conditions, setConditions] = useState([]);
//   const [openDocIndex, setOpenDocIndex] = useState(null);
//   const [protocols, setProtocols] = useState([]);
//   const [selectedProtocols, setSelectedProtocols] = useState([]);
// const [protocolSearch, setProtocolSearch] = useState("");

//   // Load protocols
//   useEffect(() => {
//     const fetchProtocols = async () => {
//       try {
//         const res = await axios.get("/api/protocols");
//         setProtocols(res.data || []);
//       } catch (err) {
//         console.error("Error fetching protocols:", err);
//       }
//     };
//     fetchProtocols();
//   }, []);

//   // Load cloned doc
//   useEffect(() => {
//     if (clonedDoc) {
//       setLabel(clonedDoc.label);
//       setConditions(clonedDoc.conditions || []);
//       setSelectedDocs(
//         clonedDoc.documents.map((d) => ({
//           document: d.document,
//           fields: d.requiredFields.map((f) => ({ ...f, required: true })),
//         }))
//       );
//       setOpenDocIndex(0);
//     }
//   }, [clonedDoc, setSelectedDocs]);

//   // Document selection
//   const handleAddDocument = (docId) => {
//     if (selectedDocs.some((d) => d.document._id === docId)) return;
//     const doc = documents.find((d) => d._id === docId);
//     if (!doc) return;

//     setSelectedDocs([
//       ...selectedDocs,
//       { document: doc, fields: doc.fields.map((f) => ({ ...f, required: false })) },
//     ]);
//     setOpenDocIndex(selectedDocs.length);
//   };

//   const toggleField = (docIndex, fieldIndex) => {
//     const updated = [...selectedDocs];
//     updated[docIndex].fields[fieldIndex].required =
//       !updated[docIndex].fields[fieldIndex].required;
//     setSelectedDocs(updated);
//   };

//   const removeDocument = (index) => {
//     const updated = [...selectedDocs];
//     updated.splice(index, 1);
//     setSelectedDocs(updated);
//     if (openDocIndex === index) setOpenDocIndex(null);
//   };

//   // Condition handlers
//   const addCondition = () => setConditions([...conditions, { value: "" }]);
//   const updateCondition = (i, v) => {
//     const u = [...conditions];
//     u[i].value = v;
//     setConditions(u);
//   };
//   const removeCondition = (i) => {
//     const u = [...conditions];
//     u.splice(i, 1);
//     setConditions(u);
//   };

//   // Protocol selection toggle
//   const toggleProtocol = (id) => {
//     if (selectedProtocols.includes(id)) {
//       setSelectedProtocols(selectedProtocols.filter((p) => p !== id));
//     } else {
//       setSelectedProtocols([...selectedProtocols, id]);
//     }
//   };

//   return (
//     <div className="reference-form">
//       {/* CATEGORY */}
//       <div className="selector-group">
//         <select value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option value="">-- ROLE --</option>
//           <option value="HR">HR</option>
//           <option value="FINANCE">FINANCE</option>
//           <option value="HEALTHCARE">HEALTHCARE</option>
//           <option value="AGRICULTURE">AGRICULTURE</option>
//           <option value="INDIAN GOVT OFFICER">INDIAN GOVT OFFICER</option>
//         </select>
//       </div>

//       {/* LABEL + DOC SELECT */}
//       {category && (
//         <div className="selector-group">
//           <input
//             type="text"
//             placeholder="Company & Position"
//             value={label}
//             onChange={(e) => setLabel(e.target.value)}
//           />
//           <select onChange={(e) => handleAddDocument(e.target.value)} defaultValue="">
//             <option value="">-- Document Name --</option>
//             {documents.map((d) => (
//               <option
//                 key={d._id}
//                 value={d._id}
//                 disabled={selectedDocs.some((sd) => sd.document._id === d._id)}
//               >
//                 {d.type}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* DOCUMENTS */}
//       {selectedDocs.length > 0 && (
//         <div className="documents-wrapper">
//           {selectedDocs.map((docObj, docIndex) => {
//             const isOpen = openDocIndex === docIndex;
//             const selectedFields = docObj.fields.filter((f) => f.required);

//             return (
//               <div
//                 className={`document-card ${isOpen ? "open" : "collapsed"}`}
//                 key={docObj.document._id}
//               >
//                 <div
//                   className="document-header"
//                   onClick={() => setOpenDocIndex(isOpen ? null : docIndex)}
//                 >
//                   <h4>{docObj.document.type}</h4>
//                   {!isOpen && selectedFields.length > 0 && (
//                     <span className="preview">
//                       {selectedFields.map((f) => f.label).join(", ")}
//                     </span>
//                   )}
//                   <button
//                     className="remove-doc-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeDocument(docIndex);
//                     }}
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {isOpen && (
//                   <div className="fields-section">
//                     {docObj.fields.map((f, i) => (
//                       <div className="field-item" key={f.key}>
//                         <input
//                           type="checkbox"
//                           checked={f.required}
//                           onChange={() => toggleField(docIndex, i)}
//                         />
//                         <span>{f.label}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* CONDITIONS */}
//       {selectedDocs.length > 0 && (
//         <div className="conditions-wrapper">
//           <h4>Conditions</h4>
//           {conditions.map((c, i) => (
//             <div className="condition-item" key={i}>
//               <textarea
//                 placeholder="Enter condition"
//                 value={c.value}
//                 onChange={(e) => updateCondition(i, e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="remove-btn"
//                 onClick={() => removeCondition(i)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//           <button type="button" className="add-condition-btn" onClick={addCondition}>
//             + Add Condition
//           </button>
//         </div>
//       )}

//      {/* PROTOCOLS SEARCH + CHECKLIST WITH FILES */}
// {category && protocols.length > 0 && (
//   <div className="protocols-wrapper">
//     <h4>Applicable Protocols</h4>

//     {/* Search Input */}
//     <input
//       type="text"
//       placeholder="Search protocols..."
//       className="protocol-search"
//       onChange={(e) => setProtocolSearch(e.target.value.toLowerCase())}
//     />

//     {protocols
//       .filter((p) =>
//         p.name.toLowerCase().includes(protocolSearch || "")
//       )
//       .map((p) => (
//         <div key={p._id} className="protocol-item">
//           <input
//             type="checkbox"
//             checked={selectedProtocols.includes(p._id)}
//             onChange={() => toggleProtocol(p._id)}
//           />
//           <span className="protocol-info">
//             <strong>{p.name}</strong> - {p.description || "No description"}
//           </span>

//           {/* Protocol main files */}
//           {p.allDocuments?.length > 0 && (
//             <ul className="protocol-files">
//               {p.allDocuments.map((file, i) => (
//                 <li key={i}>
//                   <a
//                     href={`/uploads/${file}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {file}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Step-specific files */}
//           {p.steps?.length > 0 &&
//             p.steps.map((step, idx) =>
//               step.documents?.length > 0 ? (
//                 <ul className="protocol-files" key={idx}>
//                   {step.documents.map((file, i) => (
//                     <li key={i}>
//                       <a
//                         href={`http://localhost:5050/uploads/${file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {file}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               ) : null
//             )}
//         </div>
//       ))}
//   </div>
// )}



//       {/* SAVE BUTTON */}
//       {label && selectedDocs.length > 0 && (
//         <button
//           type="button"
//           className="save-btn"
//           onClick={() =>
//             onSave({
//               label,
//               category,
//               selectedDocs,
//               conditions,
//               protocols: selectedProtocols,
//             })
//           }
//         >
//           Save Documents
//         </button>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import axios from "axios";
import "./ReferenceDocumentForm.css";

export default function ReferenceDocumentForm({
  category,
  setCategory,
  documents,
  selectedDocs,
  setSelectedDocs,
  onSave,
  clonedDoc,
}) {
  const [label, setLabel] = useState("");
  const [conditions, setConditions] = useState([]);
  const [openDocIndex, setOpenDocIndex] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocols, setSelectedProtocols] = useState([]);
  const [protocolSearch, setProtocolSearch] = useState("");

  // Fetch all protocols
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const res = await axios.get("/api/protocols");
        setProtocols(res.data || []);
      } catch (err) {
        console.error("Error fetching protocols:", err);
      }
    };
    fetchProtocols();
  }, []);

  // Handle cloning
  useEffect(() => {
    if (clonedDoc) {
      setLabel(clonedDoc.label);
      setConditions(clonedDoc.conditions || []);
      setSelectedDocs(
        clonedDoc.documents.map((d) => ({
          document: d.document,
          fields: d.requiredFields.map((f) => ({ ...f, required: true })),
        }))
      );
      // ✅ populate selectedProtocols from clonedDoc
      setSelectedProtocols(clonedDoc.protocols?.map((p) => p._id) || []);
      setOpenDocIndex(0);
    }
  }, [clonedDoc, setSelectedDocs]);

  const handleAddDocument = (docId) => {
    if (selectedDocs.some((d) => d.document._id === docId)) return;
    const doc = documents.find((d) => d._id === docId);
    if (!doc) return;

    setSelectedDocs([
      ...selectedDocs,
      { document: doc, fields: doc.fields.map((f) => ({ ...f, required: false })) },
    ]);
    setOpenDocIndex(selectedDocs.length);
  };

  const toggleField = (docIndex, fieldIndex) => {
    const updated = [...selectedDocs];
    updated[docIndex].fields[fieldIndex].required = !updated[docIndex].fields[fieldIndex].required;
    setSelectedDocs(updated);
  };

  const removeDocument = (index) => {
    const updated = [...selectedDocs];
    updated.splice(index, 1);
    setSelectedDocs(updated);
    if (openDocIndex === index) setOpenDocIndex(null);
  };

  // Condition handlers
  const addCondition = () => setConditions([...conditions, { value: "" }]);
  const updateCondition = (i, v) => {
    const u = [...conditions];
    u[i].value = v;
    setConditions(u);
  };
  const removeCondition = (i) => {
    const u = [...conditions];
    u.splice(i, 1);
    setConditions(u);
  };

  // Protocol toggle
  const toggleProtocol = (id) => {
    if (selectedProtocols.includes(id)) {
      setSelectedProtocols(selectedProtocols.filter((p) => p !== id));
    } else {
      setSelectedProtocols([...selectedProtocols, id]);
    }
  };

  // Save handler
  const handleSave = () => {
    const payload = {
      label,
      category,
      selectedDocs,
      conditions,
      protocols: selectedProtocols, // ✅ always send selected protocols
    };
    console.log("Saving Reference Document:", payload);
    onSave(payload);
  };

  return (
    <div className="reference-form">
      {/* CATEGORY */}
      <div className="selector-group">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- ROLE --</option>
          <option value="HR">HR</option>
          <option value="FINANCE">FINANCE</option>
          <option value="HEALTHCARE">HEALTHCARE</option>
          <option value="AGRICULTURE">AGRICULTURE</option>
          <option value="INDIAN GOVT OFFICER">INDIAN GOVT OFFICER</option>
        </select>
      </div>

      {/* LABEL + DOCUMENT SELECT */}
      {category && (
        <div className="selector-group">
          <input
            type="text"
            placeholder="Company & Position"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <select onChange={(e) => handleAddDocument(e.target.value)} defaultValue="">
            <option value="">-- Document Name --</option>
            {documents.map((d) => (
              <option
                key={d._id}
                value={d._id}
                disabled={selectedDocs.some((sd) => sd.document._id === d._id)}
              >
                {d.type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* DOCUMENTS */}
      {selectedDocs.length > 0 && (
        <div className="documents-wrapper">
          {selectedDocs.map((docObj, docIndex) => {
            const isOpen = openDocIndex === docIndex;
            const selectedFields = docObj.fields.filter((f) => f.required);

            return (
              <div className={`document-card ${isOpen ? "open" : "collapsed"}`} key={docObj.document._id}>
                <div className="document-header" onClick={() => setOpenDocIndex(isOpen ? null : docIndex)}>
                  <h4>{docObj.document.type}</h4>
                  {!isOpen && selectedFields.length > 0 && (
                    <span className="preview">{selectedFields.map((f) => f.label).join(", ")}</span>
                  )}
                  <button
                    className="remove-doc-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(docIndex);
                    }}
                  >
                    ✕
                  </button>
                </div>

                {isOpen && (
                  <div className="fields-section">
                    {docObj.fields.map((f, i) => (
                      <div className="field-item" key={f.key}>
                        <input type="checkbox" checked={f.required} onChange={() => toggleField(docIndex, i)} />
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CONDITIONS */}
      {selectedDocs.length > 0 && (
        <div className="conditions-wrapper">
          <h4>Conditions</h4>
          {conditions.map((c, i) => (
            <div className="condition-item" key={i}>
              <textarea placeholder="Enter condition" value={c.value} onChange={(e) => updateCondition(i, e.target.value)} />
              <button type="button" className="remove-btn" onClick={() => removeCondition(i)}>✕</button>
            </div>
          ))}
          <button type="button" className="add-condition-btn" onClick={addCondition}>
            + Add Condition
          </button>
        </div>
      )}

      {/* PROTOCOLS */}
      {category && protocols.length > 0 && (
        <div className="protocols-wrapper">
          <h4>Applicable Protocols</h4>
          <input
            type="text"
            placeholder="Search protocols..."
            className="protocol-search"
            onChange={(e) => setProtocolSearch(e.target.value.toLowerCase())}
          />
          {protocols
            .filter((p) => p.name.toLowerCase().includes(protocolSearch || ""))
            .map((p) => (
              <div key={p._id} className="protocol-item">
                <input type="checkbox" checked={selectedProtocols.includes(p._id)} onChange={() => toggleProtocol(p._id)} />
                <span className="protocol-info"><strong>{p.name}</strong> - {p.description || "No description"}</span>
              </div>
            ))}
        </div>
      )}

      {/* SAVE BUTTON */}
      {label && selectedDocs.length > 0 && (
        <button type="button" className="save-btn" onClick={handleSave}>
          Save Documents
        </button>
      )}
    </div>
  );
}
