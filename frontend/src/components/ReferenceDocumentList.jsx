// import "./ReferenceDocumentList.css";

// export default function ReferenceDocumentList({ category, refDocs, onClone }) {
//   const filtered = category
//     ? refDocs.filter((r) => r.category === category)
//     : refDocs;

//   return (
//     <div className="reference-list">
//       <h3>📂 Reference Documents {category && `(${category})`}</h3>
//       {filtered.length === 0 && <p>No reference documents yet.</p>}

//       {filtered.map((rd) => (
//         <div key={rd._id} className="reference-card" data-category={rd.category}>
//           <h4>{rd.label}</h4>
//           <p>
            
//           </p>

//           {rd.documents.map((doc) => (
//             <div key={doc.document._id}>
//               <b>Document:</b> {doc.document.type}
//               <ul>
//                 {doc.requiredFields.map((f) => (
//                   <li key={f.key}>{f.label}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           {rd.conditions.length > 0 && (
//             <div>
//               <b>Conditions:</b>
//               <ul>
//                 {rd.conditions.map((c, i) => (
//                   <li key={i}>{c.value}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <button className="clone-btn" onClick={() => onClone(rd._id)}>
//             Clone
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useState } from "react";
import "./ReferenceDocumentList.css";

export default function ReferenceDocumentList({ category, refDocs, onClone }) {
  const filtered = category
    ? refDocs.filter((r) => r.category === category)
    : refDocs;

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="reference-list">
      <h3>📂 Reference Documents {category && `(${category})`}</h3>

      {filtered.length === 0 && <p>No reference documents yet.</p>}

      {paginatedData.map((rd) => (
        <div key={rd._id} className="reference-card">
          <h4 className="label">{rd.label}</h4>
          <p><b>Category:</b> {rd.category}</p>

          {/* Documents */}
          {rd.documents && rd.documents.length > 0 && (
            <div className="section documents-section">
              <b>Documents:</b>
              {rd.documents.map((doc) =>
                doc.document ? (
                  <div key={doc.document._id} className="doc-item">
                    <p><b>Type:</b> {doc.document.type}</p>
                    {doc.requiredFields?.length > 0 && (
                      <ul>
                        {doc.requiredFields.map((f) => (
                          <li key={f.key || f.label}>{f.label}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p key={Math.random()} className="error-text">Document missing</p>
                )
              )}
            </div>
          )}

          {/* Conditions */}
          {rd.conditions && rd.conditions.length > 0 && (
            <div className="section conditions-section">
              <b>Conditions:</b>
              <ul>
                {rd.conditions.map((c, i) => (
                  <li key={c.field ? c.field + i : i}>
                    {c.field && c.operator ? `${c.field} ${c.operator} ${c.value}` : c.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Protocols */}
          {rd.protocols && rd.protocols.length > 0 && (
            <div className="section protocols-section">
              <b>Protocols:</b>
              {rd.protocols.map((p) =>
                p ? (
                  <div key={p._id || p} className="protocol-item">
                    <strong>{p.name}</strong>
                    {p.description && <span> — {p.description}</span>}

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

                    {/* Step-specific files */}
                    {p.steps?.length > 0 && p.steps.map((step, idx) =>
                      step.documents?.length > 0 ? (
                        <ul className="protocol-files" key={idx}>
                          {step.documents.map((file, i) => (
                            <li key={i}>
                              <a
                                href={`https://docuvault-agmi.onrender.com/uploads/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null
                    )}
                  </div>
                ) : (
                  <p key={Math.random()} className="error-text">Protocol missing</p>
                )
              )}
            </div>
          )}

          {/* Clone Button */}
          <button className="clone-btn" onClick={() => onClone(rd._id)}>Clone</button>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
