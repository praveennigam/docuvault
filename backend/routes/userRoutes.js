import express from "express";
import {
  registerUser,
  getAllUsers,
  getRoleFields,
  loginUser,
  getUserById,
  updateUserFields,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/role/:roleId", getRoleFields);

// ✅ Get user by ID
router.get("/:id", getUserById);

// ✅ Update user fields
router.put("/:id", updateUserFields);

export default router;
