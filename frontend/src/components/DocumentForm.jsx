import { useState } from "react";
import axios from "axios";
import "./DocumentForm.css";

const categories = ["KYC", "FINANCE", "EDUCATION", "LEGAL", "HEALTH", "OTHER"];

export default function DocumentForm({ onAdd }) {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [fields, setFields] = useState([]);

  // Add a new field
  const addField = () => {
    const nextKey = `key_${fields.length + 1}`;
    setFields([...fields, { key: nextKey, label: "" }]);
  };

  // Update label of a field
  const handleFieldChange = (index, value) => {
    const updated = [...fields];
    updated[index].label = value;
    setFields(updated);
  };

  // Delete a field
  const handleDeleteField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    const rekeyed = updated.map((f, i) => ({ key: `key_${i + 1}`, label: f.label }));
    setFields(rekeyed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !type) {
      alert("Please select category and enter document type.");
      return;
    }

    // ✅ Remove all empty fields before saving
    const validFields = fields.filter((f) => f.label.trim() !== "");

    if (validFields.length === 0) {
      alert("Please add at least one valid field.");
      return;
    }

    // ✅ Re-key the valid fields properly (key_1, key_2, etc.)
    const rekeyed = validFields.map((f, i) => ({
      key: `key_${i + 1}`,
      label: f.label,
    }));

    try {
      await axios.post("/api/documents", { category, type, fields: rekeyed });

      // Reset after save
      setCategory("");
      setType("");
      setFields([]);
      onAdd();
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
    }
  };

  return (
    <form className="document-form" onSubmit={handleSubmit}>
      {/* Category select */}
      <div className="form-group">
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Document type input */}
      <div className="form-group">
        <label>Document Type:</label>
        <input
          type="text"
          placeholder="Enter document type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Dynamic fields */}
      {fields.map((f, index) => (
        <div key={f.key} className="custom-field-row">
          <input
            type="text"
            placeholder={`Field Label ${index + 1} (e.g., Name, Phone)`}
            value={f.label}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            className="input-field full-width"
          />
          <span className="field-key">{f.key}</span>
          <button
            type="button"
            className="btn delete-btn"
            onClick={() => handleDeleteField(index)}
          >
            Delete
          </button>
        </div>
      ))}

      <button type="button" className="btn add-btn" onClick={addField}>
        + Add Field
      </button>

      <button type="submit" className="btn save-btn">
        Save Document
      </button>
    </form>
  );
}
