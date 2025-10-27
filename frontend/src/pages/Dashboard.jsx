import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Tesseract from "tesseract.js";
import "./Dashboard.css";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // 🟢 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("📡 Fetching user data for ID:", storedUser?.id);
        const res = await fetch(`/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("✅ User data fetched:", data);

        if (res.ok) setUserData(data);
        else console.error("❌ Failed to fetch user:", data.message);
      } catch (err) {
        console.error("🚨 Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (storedUser?.id) fetchUser();
  }, [storedUser?.id, token]);

  // 🟢 Logout
  const handleLogout = () => {
    console.log("🚪 Logging out user...");
    localStorage.clear();
    navigate("/");
  };

  // 🟢 Input field change
  const handleChange = (key, value) => {
    console.log(`✏️ Updating field [${key}] to [${value}]`);
    setUserData((prev) => ({
      ...prev,
      requiredFields: prev.requiredFields.map((f) =>
        f.key === key ? { ...f, value } : f
      ),
    }));
  };

  // 🟢 Save/Update profile
  const handleSave = async () => {
    setSaving(true);
    console.log("💾 Saving updated user data:", userData);
    try {
      const res = await fetch(`/api/users/${storedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requiredFields: userData.requiredFields }),
      });
      const data = await res.json();
      console.log("🟢 Save response:", data);

      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setUserData(data);
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch (err) {
      console.error("🚨 Update Error:", err);
    } finally {
      setSaving(false);
    }
  };

  // 🟢 Handle File Upload (PDF/Image)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log("📂 File uploaded:", file);

    setUploading(true);
    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        console.log("📄 Reading PDF file...");
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        console.log("✅ PDF loaded with pages:", pdf.numPages);

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item) => item.str).join(" ");
          console.log(`📘 Page ${i} text:`, text);
          extractedText += text + " ";
        }
      } else if (file.type.startsWith("image/")) {
        console.log("🖼️ Reading Image file with Tesseract...");
        const result = await Tesseract.recognize(file, "eng");
        console.log("✅ OCR Result:", result.data.text);
        extractedText = result.data.text;
      }

      console.log("📊 Final Extracted Text:", extractedText);

      if (extractedText) fillFieldsFromText(extractedText);
      else alert("❌ Could not extract any text.");
    } catch (err) {
      console.error("🚨 Error reading file:", err);
      alert("❌ Failed to read file");
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Fill fields from text (auto update)
  const fillFieldsFromText = (text) => {
    console.log("🧠 Processing extracted text to auto-fill fields...");
    const updatedFields = userData.requiredFields.map((field) => {
      const key = field.key.toLowerCase();
      let value = field.value || "";

      if (key.includes("name")) {
        const match = text.match(/name[:\s]+([A-Za-z\s]+)/i);
        if (match) value = match[1].trim();
      } else if (key.includes("email")) {
        const match = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
        if (match) value = match[0];
      } else if (key.includes("phone") || key.includes("mobile")) {
        const match = text.match(/\b\d{10}\b/);
        if (match) value = match[0];
      } else if (key.includes("pan")) {
        const match = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
        if (match) value = match[0];
      } else if (key.includes("address")) {
        const match = text.match(/address[:\s]+([A-Za-z0-9\s,.-]+)/i);
        if (match) value = match[1].trim();
      }

      console.log(`🧾 Field: ${field.label}, Extracted Value: ${value}`);
      return { ...field, value };
    });

    console.log("✅ Updated fields:", updatedFields);
    setUserData((prev) => ({ ...prev, requiredFields: updatedFields }));
    alert("✅ Data auto-filled from uploaded file!");
  };

  // 🟢 Chat handling
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    console.log("💬 User asked:", chatInput);
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);

    const lower = chatInput.toLowerCase();
    const field = userData.requiredFields.find((f) =>
      lower.includes(f.label.toLowerCase())
    );

    let reply = "";
    if (field && field.value) {
      reply = `${field.label}: ${field.value}`;
      console.log("🤖 Bot found value:", reply);
    } else {
      reply =
        "🤖 I couldn’t find that info. Please check your profile fields or upload a document.";
      console.log("🤖 Bot reply (no match):", reply);
    }

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);

    setChatInput("");
  };

  // 🧮 Group fields by type (e.g., "Pan Card", "Aadhaar")
  const groupedFields = userData?.requiredFields?.reduce((acc, field) => {
    const type = field.type || "General";
    if (!acc[type]) acc[type] = [];
    acc[type].push(field);
    return acc;
  }, {}) || {};

  const filled = userData?.requiredFields?.filter((f) => f.value)?.length || 0;
  const total = userData?.requiredFields?.length || 1;
  const progress = Math.round((filled / total) * 100);
  console.log(`📊 Field completion: ${filled}/${total} (${progress}%)`);

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container-unique">
      <div className="left-panel-unique">
        <div className="progress-wrapper">
          <div className="progress-bar-unique" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>

        <h2>👋 Welcome, {userData?.email}</h2>
        <p>Role: <strong>{userData?.role?.label || "User"}</strong></p>

        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileUpload}
          className="file-upload-unique"
        />
        {uploading && <p>📄 Extracting data...</p>}

        <div className="fields-list-unique">
          {Object.keys(groupedFields).map((type) => (
            <div key={type} className="type-section">
              <h3 className="type-title">📑 {type}</h3>
              {groupedFields[type].map((field, idx) => (
                <div className="input-group-unique" key={`${field.key}_${idx}`}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={field.value || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="button-group-unique">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="right-panel-unique">
        <div className="chat-header-unique">💬 Smart Assistant</div>
        <div className="chat-body-unique">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <form className="chat-input-box" onSubmit={handleChatSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit">Send 🚀</button>
        </form>
      </div>
    </div>
  );
}
