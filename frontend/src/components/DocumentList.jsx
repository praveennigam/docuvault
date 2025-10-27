import axios from "axios";
import "./DocumentList.css";

export default function DocumentList({ documents, onDelete }) {
  const deleteDoc = async (id) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      onDelete();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="document-list">
      {documents.length === 0 && <p className="no-docs">No documents added yet.</p>}
      
      {documents.map((doc) => (
        <div key={doc._id} className="document-card">
          <div className="card-header">
            <h2 className="doc-type">{doc.type}</h2>
            <span className="doc-category">{doc.category}</span>
          </div>

          <ul className="doc-fields">
            {(doc.fields || []).map((f) => (
              <li key={f.key} className="field-row">
                <span className="field-key">{f.key}</span>
                <span className="field-label">{f.label}</span>
              </li>
            ))}
          </ul>

          <button
            className="btn delete-btn"
            onClick={() => deleteDoc(doc._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
