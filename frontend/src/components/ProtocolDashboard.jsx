import { useState, useEffect } from "react";
import axios from "axios";
import "./ProtocolDashboard.css";

export default function ProtocolDashboard() {
  const [protocols, setProtocols] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]); // ✅ new: existing files
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  

  const fetchProtocols = async () => {
    try {
      const res = await axios.get("/api/protocols");
      setProtocols(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  const handleFileSelect = (e) => setSelectedFiles([...e.target.files]);

  const handleSave = async () => {
    try {
      const payload = {
        name,
        description,
        allDocuments: existingFiles, // ✅ keep existing files
        createdBy: "User",
      };

      let protocol;
      if (editingId) {
        const res = await axios.put(`/api/protocols/${editingId}`, payload);
        protocol = res.data;
        alert("Protocol updated!");
      } else {
        const res = await axios.post("/api/protocols", payload);
        protocol = res.data;
        alert("Protocol created!");
      }

      if (selectedFiles.length) {
        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append("files", f));

        const uploadRes = await axios.post(
          `/api/protocols/upload/${protocol._id}/0`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Ensure we have an array of filenames
        let uploadedFiles = [];
        if (Array.isArray(uploadRes.data)) {
          uploadedFiles = uploadRes.data.map(f => f.filename);
        } else if (uploadRes.data.filename) {
          uploadedFiles = [uploadRes.data.filename];
        } else if (uploadRes.data.files) {
          uploadedFiles = uploadRes.data.files.map(f => f.filename);
        }

        setExistingFiles([...existingFiles, ...uploadedFiles]);
      }


      resetForm();
      fetchProtocols();
    } catch (err) {
      console.error("Error saving protocol or uploading files:", err);
      alert("Error saving protocol or uploading files");
    }
  };

  const handleEdit = (p) => {
  setEditingId(p._id);
  setName(p.name);
  setDescription(p.description);
  setSelectedFiles([]);
  setExistingFiles(p.allDocuments || []);

  // Scroll to top of the form when editing
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`/api/protocols/${id}`);
    fetchProtocols();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setSelectedFiles([]);
    setExistingFiles([]);
  };

  const totalPages = Math.ceil(protocols.length / itemsPerPage);
  const currentProtocols = protocols.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="protocol-dashboard">
      <h2>📑 Protocols</h2>

      <div className="protocol-form">
        <input
          type="text"
          placeholder="Protocol Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ✅ Show existing files first */}
        {existingFiles.length > 0 && (
          <ul>
            {existingFiles.map((file, i) => (
              <li key={i}>
                <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">{file}</a>
              </li>
            ))}
          </ul>
        )}

        {/* New files to upload */}
        <input type="file" multiple onChange={handleFileSelect} />
        {selectedFiles.length > 0 && (
          <ul>
            {selectedFiles.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}

        <button onClick={handleSave}>
          {editingId ? "Update Protocol" : "Save Protocol"}
        </button>
        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <h3>All Protocols</h3>
      {currentProtocols.map((p) => (
        <div key={p._id} className="protocol-card">
          <h4>{p.name}</h4>
          <p><strong>Description:</strong> {p.description}</p>

          {p.allDocuments?.length > 0 && (
            <div>
              <strong>Main Files:</strong>
              <ul>
                {p.allDocuments.map((file, i) => (
                  <li key={i}>
                    <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">{file}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.steps?.length > 0 && (
            <div>
              
              {p.steps.map((step, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  
                  {step.description?.length > 0 && (
                    <ul>
                      {step.description.map((d, i) => (
                        <li key={i}>
                          {d.text} <span style={{ fontStyle: "italic", color: "#555" }}>({d.addedBy})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {step.documents?.length > 0 && (
                    <ul>
                      {step.documents.map((file, i) => (
                        <li key={i}>
                          <a href={`http://localhost:5050/uploads/${file}`} target="_blank" rel="noopener noreferrer">{file}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
