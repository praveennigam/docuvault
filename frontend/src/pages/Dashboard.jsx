import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [demoFields, setDemoFields] = useState({}); // Track demo placeholders

  // 🟢 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setDemoFields({});
        }
      } catch {
        alert("❌ Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    if (storedUser?.id) fetchUser();
  }, [storedUser?.id, token]);

  // 🟢 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🟢 File Upload / Replace
  const handleFileUpload = async (e, type, isReplace = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Temporary placeholder
    setDemoFields((prev) => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", storedUser.id);
      formData.append("replace", isReplace ? "true" : "false");

      const res = await fetch(`/api/users/upload/${type}/${storedUser.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${type} ${isReplace ? "replaced" : "uploaded"} successfully!`);
        setUserData((prev) => ({
          ...prev,
          requiredFields: data.updatedFields,
        }));
      } else {
        alert(`❌ ${data.message || "Upload failed"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ File upload failed");
    } finally {
      setDemoFields((prev) => {
        const copy = { ...prev };
        delete copy[type];
        return copy;
      });
    }
  };

  // 🟢 Save Profile
  const handleSave = async () => {
    setSaving(true);
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
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setUserData(data);
        setDemoFields({});
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch {
      alert("❌ Update Error");
    } finally {
      setSaving(false);
    }
  };

  // 🧮 Group fields by document type
  const groupedFields =
    userData?.requiredFields?.reduce((acc, field) => {
      const type = field.type || "General";
      if (!acc[type]) acc[type] = [];
      acc[type].push(field);
      return acc;
    }, {}) || {};

  // 🧠 Calculate Progress
  const totalFields = userData?.requiredFields?.length || 0;
  const filledFields =
    userData?.requiredFields?.filter((f) => f.value && f.value.trim() !== "")
      ?.length || 0;
  const uploadedFiles =
    userData?.requiredFields?.filter((f) => f.fileUrl)?.length || 0;
  const protocolCount = userData?.protocols?.length || 0;
  const conditionCount = userData?.conditions?.length || 0;

  const totalItems = totalFields + 2;
  const completedItems = filledFields + uploadedFiles;
  const progress =
    Math.min(
      100,
      Math.round(
        ((completedItems +
          (protocolCount > 0 ? 1 : 0) +
          (conditionCount > 0 ? 1 : 0)) /
          totalItems) *
          100
      )
    ) || 0;

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <>
      <div className="progress-wrapper">
        <div className="progress-bar-unique" style={{ width: `${progress}%` }}>
          {progress}%
        </div>
      </div>

      <div className="dashboard-container-unique">
        {/* 🔹 Left Panel */}
        <div className="left-panel-unique scrollable">
          <h2>👋 Welcome, {userData?.email}</h2>
          <p>
            Applied Sop: <strong>{userData?.role?.label || "User"}</strong> |
            Company/Position: <strong>{userData?.role?.category}</strong>
          </p>

          {/* 🧾 Fields */}
          <div className="fields-list-unique">
            {Object.keys(groupedFields).map((type) => {
              const allUploads = groupedFields[type]
                .flatMap((field) => field.uploads || [])
                .filter(Boolean);

              const uniqueUploads = [
                ...new Map(
                  allUploads.map((fileObj) => [
                    `http://localhost:5050${fileObj.filePath}`,
                    fileObj,
                  ])
                ).values(),
              ];

              const hasUploaded = uniqueUploads.length > 0;

              return (
                <div key={type} className="type-section">
                  <h3 className="type-title">📑 {type}</h3>

                  {/* 🟢 Upload / Replace Buttons */}
                  {!hasUploaded ? (
                    <label className="upload-btn-small">
                      📤 Upload {type}
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        hidden
                        onChange={(e) => handleFileUpload(e, type, false)}
                      />
                    </label>
                  ) : (
                    <div className="file-preview">
                      {uniqueUploads.map((fileObj, j) => {
                        const fileUrl = `http://localhost:5050${fileObj.filePath}`;
                        return (
                          <div key={j} className="file-box">
                            <button
                              className="view-btn"
                              title={`View ${fileObj.fileName}`}
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              View
                            </button>
                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                hidden
                                onChange={(e) => handleFileUpload(e, type, true)}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 🔹 Fields display */}
                  {groupedFields[type].map((field, idx) => (
                    <div
                      className="input-group-unique"
                      key={`${field.key}_${idx}`}
                    >
                      <label>{field.label}</label>
                      <input
                        type="text"
                        readOnly
                        value={
                          demoFields[type]
                            ? `@demo_${field.key}`
                            : field.value || ""
                        }
                        placeholder={
                          demoFields[type]
                            ? `@demo_${field.key}`
                            : ` ${field.label}`
                        }
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

           {/* 🧩 Protocols */}
          {userData?.protocols?.length > 0 && (
            <div className="extra-section">
              <h3>🧩 Protocols</h3>
              <ul>
                {userData.protocols.map((protocol, i) => (
                  <li key={protocol._id || i} className="protocol-item">
                    <strong>{protocol.name}</strong>
                    {protocol.description && <p>{protocol.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 🧠 Conditions */}
          {userData?.conditions?.length > 0 && (
            <div className="extra-section">
              <h3>🧠 Conditions</h3>
              <ul>
                {userData.conditions.map((c, i) => (
                  <li key={i}>{c.value || JSON.stringify(c)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 💾 Buttons */}
          <div className="button-group-unique">
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "💾 Save"}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* 💬 Chat Section */}
        <div className="right-panel-unique">
          <div className="chat-header-unique">💬 Smart Assistant</div>
          <div className="chat-body-unique">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form
            className="chat-input-box"
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;

              const userMsg = { sender: "user", text: chatInput };
              setChatMessages((prev) => [...prev, userMsg]);

              const reply =
                "🤖 Smart Assistant will soon provide dynamic guidance based on your data!";
              setTimeout(() => {
                setChatMessages((prev) => [
                  ...prev,
                  { sender: "bot", text: reply },
                ]);
              }, 600);

              setChatInput("");
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              Send 🚀
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
