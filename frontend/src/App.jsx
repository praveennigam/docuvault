import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DocumentForm from "./components/DocumentForm";
import DocumentList from "./components/DocumentList";
import ReferenceDashboard from "./components/ReferenceDashboard";
import ProtocolDashboard from "./components/ProtocolDashboard"; // ✅ NEW
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get("/api/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">📄 Document Dashboard</h1>
        <nav className="nav-bar">
          <Link to="/">Documents</Link>
          <Link to="/reference">Reference Documents</Link>
          <Link to="/protocols">Protocols</Link> {/* ✅ New */}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <DocumentForm onAdd={fetchDocs} />
                <DocumentList documents={documents} onDelete={fetchDocs} />
              </>
            }
          />
          <Route path="/reference" element={<ReferenceDashboard />} />
          <Route path="/protocols" element={<ProtocolDashboard />} /> {/* ✅ New */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
