// // import mongoose from "mongoose";

// // const requiredFieldSchema = new mongoose.Schema({
// //   key: { type: String, required: true },
// //   label: { type: String, required: true },
// //   value: { type: String, default: "" }, // user will fill later
// // });

// // const userSchema = new mongoose.Schema(
// //   {
// //     role: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "ReferenceDocument", // comes from /api/reference-documents
// //       required: true,
// //     },
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },
// //     requiredFields: [requiredFieldSchema], // auto-generated from selected role
// //     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // who registered this user
// //   },
// //   { timestamps: true }
// // );

// // const User = mongoose.model("User", userSchema);
// // export default User;


// import mongoose from "mongoose";

// const requiredFieldSchema = new mongoose.Schema({
//   key: { type: String, required: true },
//   label: { type: String, required: true },
//   type: { type: String, default: "" }, // ✅ document type like "Pan Card"
//   value: { type: String, default: "" },

//   // ✅ Upload Info (new fields)
//   fileName: { type: String, default: "" }, // e.g. "aadhar_front_1730123342.pdf"
//   fileType: { type: String, enum: ["image", "pdf", ""], default: "" },
//   filePath: { type: String, default: "" }, // e.g. "uploads/aadhar_front_1730123342.pdf"
//   uploadedAt: { type: Date, default: null },
// });

// const userSchema = new mongoose.Schema(
//   {
//     role: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ReferenceDocument",
//       required: true,
//     },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     requiredFields: [requiredFieldSchema], // includes upload data

//     conditions: { type: Array, default: [] },
//     protocols: [{ type: mongoose.Schema.Types.ObjectId, ref: "Protocol" }],
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export default User;



import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema({
  fileName: String,
  fileType: String, // image or pdf
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
});

const requiredFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: "" }, // like "PAN Card"
  value: { type: String, default: "" },

  // ✅ Multiple uploads per field
  uploads: [uploadedFileSchema],
});

const userSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferenceDocument",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    requiredFields: [requiredFieldSchema],
    conditions: { type: Array, default: [] },
    protocols: [{ type: mongoose.Schema.Types.ObjectId, ref: "Protocol" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
