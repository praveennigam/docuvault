import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ["KYC", "FINANCE", "EDUCATION", "LEGAL", "HEALTH","OTHER"], 
    required: true 
  },
  type: { type: String, required: true }, // Aadhaar, PAN, etc.
  fields: [
    {
      key: { type: String, required: true },   // key_1, key_2, ... exactly as frontend
      label: { type: String, required: true }, // e.g., Name, Aadhaar No
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
