import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch full user details including requiredFields
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setUserData(data);
        else alert(data.message || "Failed to fetch user");
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Server error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    if (storedUser?.id) fetchUser();
  }, [storedUser?.id, token]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // ✅ Handle input change
  const handleChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      requiredFields: prev.requiredFields.map((f) =>
        f.key === key ? { ...f, value } : f
      ),
    }));
  };

  // ✅ Save updated fields
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
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("❌ Server error while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>🎉 Welcome, {userData?.email}</h2>
        <p className="sub-text">
          You’re logged in as <strong>{userData?.role?.label || "User"}</strong>
        </p>

        <div className="profile-section">
          <h3>🧾 My Details</h3>
          {userData?.requiredFields?.map((field) => (
            <div className="input-group" key={field.key}>
              <label>{field.label}</label>
              <input
                type="text"
                value={field.value || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="action-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
