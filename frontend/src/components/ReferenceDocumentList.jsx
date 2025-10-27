import { useState } from "react";
import "./ReferenceDocumentList.css";

export default function ReferenceDocumentList({ category, refDocs, onClone }) {
  const filtered = category
    ? refDocs.filter((r) => r.category === category)
    : refDocs;

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const [expandedDocs, setExpandedDocs] = useState([]);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (id) => {
    setExpandedDocs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="reference-list-container">
      <h3 className="page-title">
        📁 Reference Documents {category && `(${category})`}
      </h3>

      {filtered.length === 0 && (
        <p className="empty-text">No reference documents available.</p>
      )}

      {paginatedData.map((rd) => {
        const isExpanded = expandedDocs.includes(rd._id);

        return (
          <div key={rd._id} className={`reference-card ${isExpanded ? "expanded" : ""}`}>
            <div className="card-header">
              <h4 className="doc-label">{rd.label || "Untitled Document"}</h4>
              <div className="card-actions">
                <button
                  className="view-btn"
                  onClick={() => toggleExpand(rd._id)}
                >
                  {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                </button>
                <button
                  className="clone-btn"
                  onClick={() => onClone(rd._id)}
                >
                  🧩 Clone
                </button>
              </div>
            </div>

            <p className="category-text">
              <b>Category:</b> {rd.category}
            </p>

            {isExpanded && (
              <div className="expanded-content">
                {/* Documents Section */}
                {rd.documents?.length > 0 && (
                  <div className="section documents-section">
                    <h5>📄 Documents</h5>
                    {rd.documents.map((doc) =>
                      doc.document ? (
                        <div key={doc.document._id} className="doc-item">
                          <p><b>Type:</b> {doc.document.type}</p>
                          {doc.requiredFields?.length > 0 && (
                            <ul className="field-list">
                              {doc.requiredFields.map((f) => (
                                <li key={f.key || f.label}>{f.label}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <p key={Math.random()} className="error-text">
                          Document missing
                        </p>
                      )
                    )}
                  </div>
                )}

                {/* Conditions */}
                {rd.conditions?.length > 0 && (
                  <div className="section conditions-section">
                    <h5>⚙️ Conditions</h5>
                    <ul>
                      {rd.conditions.map((c, i) => (
                        <li key={i}>{c.value || `${c.field} ${c.operator} ${c.value}`}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Protocols */}
                {rd.protocols?.length > 0 && (
                  <div className="section protocols-section">
                    <h5>📜 Protocols</h5>
                    {rd.protocols.map((p) =>
                      p ? (
                        <div key={p._id || p} className="protocol-item">
                          <strong>{p.name}</strong>
                          {p.description && (
                            <span className="protocol-desc"> — {p.description}</span>
                          )}
                          {/* Protocol files */}
                          {p.allDocuments?.length > 0 && (
                            <ul className="protocol-files">
                              {p.allDocuments.map((file, i) => (
                                <li key={i}>
                                  <a
                                    href={`/uploads/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <p key={Math.random()} className="error-text">
                          Protocol missing
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
