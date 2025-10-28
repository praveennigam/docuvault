// import mongoose from "mongoose";

// const conditionSchema = new mongoose.Schema({
//   field: { type: String },
//   operator: { type: String },
//   value: { type: String },
// });

// const requiredFieldSchema = new mongoose.Schema({
//   key: { type: String },
//   label: { type: String },
// });

// const documentSchema = new mongoose.Schema({
//   document: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Document", // Refers to your main Document model
//     required: true,
//   },
//   requiredFields: [requiredFieldSchema],
// });

// const referenceDocumentSchema = new mongoose.Schema(
//   {
//     label: { type: String, required: true },
//     category: { type: String, required: true },
//     documents: [documentSchema],
//     conditions: [conditionSchema],

//     // 🧩 Protocol integration
//     protocols: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Protocol",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const ReferenceDocument = mongoose.model(
//   "ReferenceDocument",
//   referenceDocumentSchema
// );

// export default ReferenceDocument;



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
    ref: "Document",
    required: true,
  },
  documentType: { type: String }, // 👈 new field to store type ("Adhaar")
  requiredFields: [requiredFieldSchema],
});

const referenceDocumentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    category: { type: String, required: true },
    documents: [documentSchema],
    conditions: [conditionSchema],
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
