// import mongoose from "mongoose";

// const referenceDocumentSchema = new mongoose.Schema({
//   label: { type: String, required: true },
//   category: {
//     type: String,
//     enum: ["HR", "FINANCE", "AGRICULTURE", "HEALTHCARE", "INDIAN GOVT OFFICER"],
//     required: true,
//   },
//   documents: [ // multiple documents in one entry
//     {
//       document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
//       requiredFields: [
//         { key: { type: String, required: true }, label: { type: String, required: true } },
//       ],
//     },
//   ],
//   conditions: [ // shared conditions for all documents
//     { field: { type: String }, operator: { type: String }, value: { type: String } },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("ReferenceDocument", referenceDocumentSchema);


import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
  field: { type: String },
  operator: { type: String },
  value: { type: String },
});

const requiredFieldSchema = new mongoose.Schema({
  key: { type: String },
  label: { type: String },
});

const documentSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document", // Refers to your main Document model
    required: true,
  },
  requiredFields: [requiredFieldSchema],
});

const referenceDocumentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    category: { type: String, required: true },
    documents: [documentSchema],
    conditions: [conditionSchema],

    // 🧩 Protocol integration
    protocols: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Protocol",
      },
    ],
  },
  { timestamps: true }
);

const ReferenceDocument = mongoose.model(
  "ReferenceDocument",
  referenceDocumentSchema
);

export default ReferenceDocument;
