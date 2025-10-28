// // // import User from "../models/User.js";
// // // import ReferenceDocument from "../models/ReferenceDocument.js";
// // // import bcrypt from "bcryptjs";
// // // import jwt from "jsonwebtoken";
// // // /**
// // //  * 🔐 User Login
// // //  */




// // // export const loginUser = async (req, res) => {
// // //   try {
// // //     const { email, password } = req.body;

// // //     if (!email || !password)
// // //       return res.status(400).json({ message: "Email and password are required" });

// // //     const user = await User.findOne({ email }).populate("role", "label category");
// // //     if (!user) return res.status(404).json({ message: "User not found" });

// // //     const isMatch = await bcrypt.compare(password, user.password);
// // //     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

// // //     // ✅ Generate JWT Token
// // //     const token = jwt.sign(
// // //       { id: user._id, email: user.email, role: user.role?.label },
// // //       process.env.JWT_SECRET || "secretkey",
// // //       { expiresIn: "7d" }
// // //     );

// // //     res.status(200).json({
// // //       message: "Login successful",
// // //       user: {
// // //         id: user._id,
// // //         email: user.email,
// // //         role: user.role?.label,
// // //       },
// // //       token, // ✅ send token to frontend
// // //     });
// // //   } catch (error) {
// // //     console.error("Login Error:", error);
// // //     res.status(500).json({ message: "Server error", error: error.message });
// // //   }
// // // };







// // // /**
// // //  * 🧾 Register new user (Admin creates user)
// // //  */
// // // export const registerUser = async (req, res) => {
// // //   try {
// // //     const { roleId, email, password } = req.body;

// // //     // Validate
// // //     if (!roleId || !email || !password) {
// // //       return res.status(400).json({ message: "All fields are required" });
// // //     }

// // //     // Check existing email
// // //     const existing = await User.findOne({ email });
// // //     if (existing) {
// // //       return res.status(400).json({ message: "Email already exists" });
// // //     }

// // //     // Get role details and its requiredFields
// // //     const roleDoc = await ReferenceDocument.findById(roleId);
// // //     if (!roleDoc) {
// // //       return res.status(404).json({ message: "Role not found" });
// // //     }

// // //     // Extract required fields from role
// // //     let roleFields = [];
// // //     roleDoc.documents.forEach((doc) => {
// // //       doc.requiredFields.forEach((field) => {
// // //         roleFields.push({ key: field.key, label: field.label, value: "" });
// // //       });
// // //     });

// // //     // Hash password
// // //     const hashedPassword = await bcrypt.hash(password, 10);

// // //     // Create new user
// // //     const newUser = new User({
// // //       role: roleId,
// // //       email,
// // //       password: hashedPassword,
// // //       requiredFields: roleFields,
// // //       createdBy: req.adminId || null, // optional
// // //     });

// // //     await newUser.save();

// // //     res.status(201).json({
// // //       message: "User registered successfully",
// // //       user: newUser,
// // //     });
// // //   } catch (error) {
// // //     console.error("Register Error:", error);
// // //     res.status(500).json({ message: "Server error", error: error.message });
// // //   }
// // // };

// // // /**
// // //  * 📋 Get all users (admin only)
// // //  */
// // // export const getAllUsers = async (req, res) => {
// // //   try {
// // //     const users = await User.find().populate("role", "label category");
// // //     res.json(users);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // /**
// // //  * 📑 Get required fields for a specific role
// // //  */
// // // export const getRoleFields = async (req, res) => {
// // //   try {
// // //     const { roleId } = req.params;
// // //     const role = await ReferenceDocument.findById(roleId);

// // //     if (!role) return res.status(404).json({ message: "Role not found" });

// // //     const allFields = [];
// // //     role.documents.forEach((doc) => {
// // //       doc.requiredFields.forEach((field) => {
// // //         allFields.push({ key: field.key, label: field.label });
// // //       });
// // //     });

// // //     res.json({ role: role.label, fields: allFields });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };




// // // // 🧩 Get single user
// // // export const getUserById = async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.params.id).populate("role", "label category");
// // //     if (!user) return res.status(404).json({ message: "User not found" });
// // //     res.json(user);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // 🧩 Update user’s requiredFields
// // // export const updateUserFields = async (req, res) => {
// // //   try {
// // //     const { requiredFields } = req.body;
// // //     const user = await User.findById(req.params.id);

// // //     if (!user) return res.status(404).json({ message: "User not found" });

// // //     user.requiredFields = requiredFields;
// // //     await user.save();

// // //     res.json(user);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };






// // import User from "../models/User.js";
// // import ReferenceDocument from "../models/ReferenceDocument.js";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";

// // /* -------------------------------------------------------------------------- */
// // /* 🔐 LOGIN USER */
// // /* -------------------------------------------------------------------------- */
// // export const loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password)
// //       return res.status(400).json({ message: "Email and password are required" });

// //     const user = await User.findOne({ email }).populate("role", "label category");
// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

// //     // ✅ Generate JWT Token
// //     const token = jwt.sign(
// //       { id: user._id, email: user.email, role: user.role?.label },
// //       process.env.JWT_SECRET || "secretkey",
// //       { expiresIn: "7d" }
// //     );

// //     res.status(200).json({
// //       message: "Login successful",
// //       user: {
// //         id: user._id,
// //         email: user.email,
// //         role: user.role?.label,
// //       },
// //       token,
// //     });
// //   } catch (error) {
// //     console.error("Login Error:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// // /* -------------------------------------------------------------------------- */
// // /* 🧾 REGISTER USER (ADMIN CREATES USER) */
// // /* -------------------------------------------------------------------------- */
// // export const registerUser = async (req, res) => {
// //   try {
// //     const { roleId, email, password } = req.body;

// //     if (!roleId || !email || !password)
// //       return res.status(400).json({ message: "All fields are required" });

// //     // Check existing email
// //     const existing = await User.findOne({ email });
// //     if (existing)
// //       return res.status(400).json({ message: "Email already exists" });

// //     // ✅ Get full ReferenceDocument with all details
// //     const roleDoc = await ReferenceDocument.findById(roleId)
// //       .populate("protocols")
// //       .populate("documents.document", "type fields");

// //     if (!roleDoc)
// //       return res.status(404).json({ message: "Role (Reference Document) not found" });

// //     // ✅ Collect all required fields from the selected docs
// //     let roleFields = [];
// //     roleDoc.documents.forEach((doc) => {
// //       const type = doc.document?.type || "Unknown";
// //       (doc.requiredFields || []).forEach((field) => {
// //         roleFields.push({
// //           key: field.key,
// //           label: field.label,
// //           type, // <-- store document type like "Pan Card"
// //           value: "",
// //         });
// //       });
// //     });

// //     // ✅ Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // ✅ Create user with conditions + protocols from reference
// //     const newUser = new User({
// //       role: roleId,
// //       email,
// //       password: hashedPassword,
// //       requiredFields: roleFields,
// //       createdBy: req.adminId || null,
// //       conditions: roleDoc.conditions || [],
// //       protocols: roleDoc.protocols || [],
// //     });

// //     await newUser.save();

// //     res.status(201).json({
// //       message: "User registered successfully with role fields, conditions, and protocols",
// //       user: newUser,
// //     });
// //   } catch (error) {
// //     console.error("Register Error:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// // /* -------------------------------------------------------------------------- */
// // /* 📋 GET ALL USERS */
// // /* -------------------------------------------------------------------------- */
// // export const getAllUsers = async (req, res) => {
// //   try {
// //     const users = await User.find().populate("role", "label category");
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // /* -------------------------------------------------------------------------- */
// // /* 📑 GET REQUIRED FIELDS FOR A ROLE */
// // /* -------------------------------------------------------------------------- */
// // export const getRoleFields = async (req, res) => {
// //   try {
// //     const { roleId } = req.params;
// //     const role = await ReferenceDocument.findById(roleId)
// //       .populate("protocols")
// //       .populate("documents.document", "type fields");

// //     if (!role) return res.status(404).json({ message: "Role not found" });

// //     const allFields = [];
// //     role.documents.forEach((doc) => {
// //       const type = doc.document?.type || "Unknown";
// //       (doc.requiredFields || []).forEach((field) => {
// //         allFields.push({ key: field.key, label: field.label, type });
// //       });
// //     });

// //     res.json({
// //       role: role.label,
// //       category: role.category,
// //       fields: allFields,
// //       conditions: role.conditions || [],
// //       protocols: role.protocols || [],
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // /* -------------------------------------------------------------------------- */
// // /* 🧩 GET SINGLE USER */
// // /* -------------------------------------------------------------------------- */
// // export const getUserById = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.params.id).populate("role", "label category");
// //     if (!user) return res.status(404).json({ message: "User not found" });
// //     res.json(user);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // /* -------------------------------------------------------------------------- */
// // /* ✏️ UPDATE USER’S REQUIRED FIELDS */
// // /* -------------------------------------------------------------------------- */
// // export const updateUserFields = async (req, res) => {
// //   try {
// //     const { requiredFields } = req.body;
// //     const user = await User.findById(req.params.id);

// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     user.requiredFields = requiredFields;
// //     await user.save();

// //     res.json(user);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };




// import User from "../models/User.js";
// import ReferenceDocument from "../models/ReferenceDocument.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// /* -------------------------------------------------------------------------- */
// /* 🔐 LOGIN USER */
// /* -------------------------------------------------------------------------- */
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });

//     const user = await User.findOne({ email }).populate("role", "label category");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//     // ✅ Generate JWT Token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role?.label },
//       process.env.JWT_SECRET || "secretkey",
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role?.label,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 🧾 REGISTER USER (ADMIN CREATES USER) */
// /* -------------------------------------------------------------------------- */
// export const registerUser = async (req, res) => {
//   try {
//     const { roleId, email, password } = req.body;

//     if (!roleId || !email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     // Check existing email
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ message: "Email already exists" });

//     // ✅ Get full ReferenceDocument with all details
//     const roleDoc = await ReferenceDocument.findById(roleId)
//       .populate("protocols")
//       .populate("documents.document", "type fields");

//     if (!roleDoc)
//       return res
//         .status(404)
//         .json({ message: "Role (Reference Document) not found" });

//     // ✅ Collect all required fields from the selected docs
//     let roleFields = [];
//     roleDoc.documents.forEach((doc) => {
//       const type = doc.document?.type || "Unknown";
//       (doc.requiredFields || []).forEach((field) => {
//         roleFields.push({
//           key: field.key,
//           label: field.label,
//           type, // <-- store document type like "Pan Card"
//           value: "",
//         });
//       });
//     });

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Create user with conditions + protocols from reference
//     const newUser = new User({
//       role: roleId,
//       email,
//       password: hashedPassword,
//       requiredFields: roleFields,
//       createdBy: req.adminId || null,
//       conditions: roleDoc.conditions || [],
//       protocols: roleDoc.protocols || [],
//     });

//     await newUser.save();

//     res.status(201).json({
//       message:
//         "User registered successfully with role fields, conditions, and protocols",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 📋 GET ALL USERS */
// /* -------------------------------------------------------------------------- */
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().populate("role", "label category");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 📑 GET REQUIRED FIELDS FOR A ROLE */
// /* -------------------------------------------------------------------------- */
// export const getRoleFields = async (req, res) => {
//   try {
//     const { roleId } = req.params;
//     const role = await ReferenceDocument.findById(roleId)
//       .populate("protocols")
//       .populate("documents.document", "type fields");

//     if (!role) return res.status(404).json({ message: "Role not found" });

//     const allFields = [];
//     role.documents.forEach((doc) => {
//       const type = doc.document?.type || "Unknown";
//       (doc.requiredFields || []).forEach((field) => {
//         allFields.push({ key: field.key, label: field.label, type });
//       });
//     });

//     res.json({
//       role: role.label,
//       category: role.category,
//       fields: allFields,
//       conditions: role.conditions || [],
//       protocols: role.protocols || [],
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 🧩 GET SINGLE USER (WITH FULL PROTOCOL DATA) */
// /* -------------------------------------------------------------------------- */
// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .populate("role", "label category")
//       .populate("protocols", "_id name description steps allDocuments"); // ✅ full protocol data

//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("❌ getUserById Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* ✏️ UPDATE USER’S REQUIRED FIELDS */
// /* -------------------------------------------------------------------------- */
// export const updateUserFields = async (req, res) => {
//   try {
//     const { requiredFields } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.requiredFields = requiredFields;
//     await user.save();

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 📤 UPLOAD FILE FOR SPECIFIC FIELD */
// /* -------------------------------------------------------------------------- */
// export const uploadFieldFile = async (req, res) => {
//   try {
//     const { userId, fieldKey } = req.body;

//     if (!req.file)
//       return res.status(400).json({ message: "No file uploaded" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const field = user.requiredFields.find((f) => f.key === fieldKey);
//     if (!field) return res.status(404).json({ message: "Field not found" });

//     field.fileName = req.file.filename;
//     field.fileUrl = `/uploads/${req.file.filename}`;
//     field.uploadedAt = new Date();

//     await user.save();

//     res.status(200).json({
//       message: `${field.label} uploaded successfully`,
//       fileUrl: field.fileUrl,
//       uploadedAt: field.uploadedAt,
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };







import User from "../models/User.js";
import ReferenceDocument from "../models/ReferenceDocument.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* -------------------------------------------------------------------------- */
/* 🔐 LOGIN USER */
/* -------------------------------------------------------------------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).populate("role", "label category");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role?.label },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role?.label },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🧾 REGISTER USER */
/* -------------------------------------------------------------------------- */
export const registerUser = async (req, res) => {
  try {
    const { roleId, email, password } = req.body;

    if (!roleId || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });

    const roleDoc = await ReferenceDocument.findById(roleId)
      .populate("protocols")
      .populate("documents.document", "type fields");

    if (!roleDoc)
      return res.status(404).json({ message: "Role not found" });

    let roleFields = [];
    roleDoc.documents.forEach((doc) => {
      const type = doc.document?.type || "Unknown";
      (doc.requiredFields || []).forEach((field) => {
        roleFields.push({
          key: field.key,
          label: field.label,
          type,
          value: "",
          uploads: [],
        });
      });
    });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      role: roleId,
      email,
      password: hashed,
      requiredFields: roleFields,
      createdBy: req.adminId || null,
      conditions: roleDoc.conditions || [],
      protocols: roleDoc.protocols || [],
    });

    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📋 GET ALL USERS */
/* -------------------------------------------------------------------------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "label category");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📑 GET REQUIRED FIELDS */
/* -------------------------------------------------------------------------- */
export const getRoleFields = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await ReferenceDocument.findById(roleId)
      .populate("protocols")
      .populate("documents.document", "type fields");

    if (!role) return res.status(404).json({ message: "Role not found" });

    const allFields = [];
    role.documents.forEach((doc) => {
      const type = doc.document?.type || "Unknown";
      (doc.requiredFields || []).forEach((field) => {
        allFields.push({ key: field.key, label: field.label, type });
      });
    });

    res.json({
      role: role.label,
      category: role.category,
      fields: allFields,
      conditions: role.conditions || [],
      protocols: role.protocols || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🧩 GET SINGLE USER */
/* -------------------------------------------------------------------------- */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role", "label category")
      .populate("protocols", "_id name description steps allDocuments");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ UPDATE USER FIELDS */
/* -------------------------------------------------------------------------- */
export const updateUserFields = async (req, res) => {
  try {
    const { requiredFields } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.requiredFields = requiredFields;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📤 UPLOAD FILE (MULTIPLE ALLOWED PER FIELD) */
/* -------------------------------------------------------------------------- */
export const uploadFieldFile = async (req, res) => {
  try {
    const { userId, fieldKey } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const field = user.requiredFields.find((f) => f.key === fieldKey);
    if (!field) return res.status(404).json({ message: "Field not found" });

    const fileType = req.file.mimetype.includes("pdf") ? "pdf" : "image";
    const fileUrl = `/uploads/${req.file.filename}`;

    field.uploads.push({
      fileName: req.file.filename,
      fileType,
      filePath: fileUrl,
      uploadedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: `${field.label} uploaded successfully`,
      uploads: field.uploads,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};
