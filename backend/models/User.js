import mongoose from "mongoose";

const requiredFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: "" }, // user will fill later
});

const userSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferenceDocument", // comes from /api/reference-documents
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    requiredFields: [requiredFieldSchema], // auto-generated from selected role
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // who registered this user
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
