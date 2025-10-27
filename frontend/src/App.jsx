import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DocumentForm from "./components/DocumentForm";
import DocumentList from "./components/DocumentList";
import ReferenceDashboard from "./components/ReferenceDashboard";
import ProtocolDashboard from "./components/ProtocolDashboard";
import UserAccess from "./pages/UserAccess"; // ✅ Import added
import "./App.css";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard"; 


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
        <nav className="nav-bar">
          <Link to="/">Documents</Link>
          <Link to="/reference">Sop</Link>
          <Link to="/protocols">Protocols</Link>
          <Link to="/dashboard">Dashboard</Link> {/* ✅ Added Dashboard link */}
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
          <Route path="/protocols" element={<ProtocolDashboard />} />
          <Route path="/dashboard" element={<UserAccess />} />
          <Route path="/user-dashboard" element={<Dashboard />} />
           <Route path="/user-dashboard" element={<UserDashboard />} />
           {/* ✅ Added route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
