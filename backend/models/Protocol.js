import mongoose from "mongoose";

const descriptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: String, default: "System" },
  createdAt: { type: Date, default: Date.now },
});

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: [descriptionSchema],
  documents: [{ type: String }], // step files
});

const protocolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" }, // ✅ added this field
    steps: [stepSchema],
    allDocuments: [{ type: String }], // main protocol files
    createdBy: { type: String, default: "System" },
    lastModifiedBy: { type: String },
  },
  { timestamps: true }
);

const Protocol = mongoose.model("Protocol", protocolSchema);
export default Protocol;
