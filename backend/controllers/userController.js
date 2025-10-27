import User from "../models/User.js";
import ReferenceDocument from "../models/ReferenceDocument.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/**
 * 🔐 User Login
 */




export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).populate("role", "label category");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role?.label },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role?.label,
      },
      token, // ✅ send token to frontend
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







/**
 * 🧾 Register new user (Admin creates user)
 */
export const registerUser = async (req, res) => {
  try {
    const { roleId, email, password } = req.body;

    // Validate
    if (!roleId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Get role details and its requiredFields
    const roleDoc = await ReferenceDocument.findById(roleId);
    if (!roleDoc) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Extract required fields from role
    let roleFields = [];
    roleDoc.documents.forEach((doc) => {
      doc.requiredFields.forEach((field) => {
        roleFields.push({ key: field.key, label: field.label, value: "" });
      });
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      role: roleId,
      email,
      password: hashedPassword,
      requiredFields: roleFields,
      createdBy: req.adminId || null, // optional
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 📋 Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "label category");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📑 Get required fields for a specific role
 */
export const getRoleFields = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await ReferenceDocument.findById(roleId);

    if (!role) return res.status(404).json({ message: "Role not found" });

    const allFields = [];
    role.documents.forEach((doc) => {
      doc.requiredFields.forEach((field) => {
        allFields.push({ key: field.key, label: field.label });
      });
    });

    res.json({ role: role.label, fields: allFields });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// 🧩 Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role", "label category");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Update user’s requiredFields
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
