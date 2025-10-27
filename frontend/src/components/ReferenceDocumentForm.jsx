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

  // ✅ Fetch all protocols
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

  // ✅ Handle cloning safely
  useEffect(() => {
    if (clonedDoc) {
      console.log("🧩 Cloning doc:", clonedDoc);

      setLabel(clonedDoc.label || "");
      setConditions(Array.isArray(clonedDoc.conditions) ? clonedDoc.conditions : []);

      // ✅ Keep cloned fields checked exactly as they were
      const clonedDocuments = Array.isArray(clonedDoc.documents) ? clonedDoc.documents : [];
      const safeDocs = clonedDocuments.map((d) => ({
        document: d.document || {},
        fields: Array.isArray(d.fields)
          ? d.fields.map((f) => ({ ...f }))
          : Array.isArray(d.requiredFields)
          ? d.requiredFields.map((f) => ({ ...f, required: true }))
          : [],
      }));

      setSelectedDocs(safeDocs);
      setSelectedProtocols(Array.isArray(clonedDoc.protocols) ? clonedDoc.protocols.map((p) => p._id) : []);
      setOpenDocIndex(0);

      console.log("✅ Safe cloned documents:", safeDocs);
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

  const handleOk = (index) => {
    console.log("✅ OK clicked for document:", selectedDocs[index]?.document?.type);
    setOpenDocIndex(null);
  };

  // ✅ Condition handlers
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

  // ✅ Protocol toggle
  const toggleProtocol = (id) => {
    if (selectedProtocols.includes(id)) {
      setSelectedProtocols(selectedProtocols.filter((p) => p !== id));
    } else {
      setSelectedProtocols([...selectedProtocols, id]);
    }
  };

  // ✅ Save handler
  const handleSave = () => {
    const payload = {
      label,
      category,
      selectedDocs,
      conditions,
      protocols: selectedProtocols,
    };
    console.log("💾 Saving Reference Document:", payload);
    onSave(payload);
  };

  return (
    <div className="reference-form">
      {/* CATEGORY */}
      <div className="selector-group">
        <h4>Sop For: </h4>
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
          <h4>Check List:</h4>
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
              <div
                className={`document-card ${isOpen ? "open" : "collapsed"}`}
                key={docObj.document._id || docIndex}
              >
                <div className="document-header" onClick={() => setOpenDocIndex(isOpen ? null : docIndex)}>
                  <h4>{docObj.document.type || "Untitled Document"}</h4>
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
                      <div className="field-item" key={f.key || i}>
                        <input
                          type="checkbox"
                          checked={f.required}
                          onChange={() => toggleField(docIndex, i)}
                        />
                        <span>{f.label}</span>
                      </div>
                    ))}

                    {/* ✅ OK Button */}
                    <button
                      type="button"
                      className="ok-btn"
                      onClick={() => handleOk(docIndex)}
                    >
                      OK
                    </button>
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
              <textarea
                placeholder="Enter condition"
                value={c.value}
                onChange={(e) => updateCondition(i, e.target.value)}
              />
              <button type="button" className="remove-btn" onClick={() => removeCondition(i)}>
                ✕
              </button>
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
                <input
                  type="checkbox"
                  checked={selectedProtocols.includes(p._id)}
                  onChange={() => toggleProtocol(p._id)}
                />
                <span className="protocol-info">
                  <strong>{p.name}</strong> - {p.description || "No description"}
                </span>
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
