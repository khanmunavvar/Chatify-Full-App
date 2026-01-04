import express from "express";
import { registerUser, authUser, allUsers } from "../controllers/userController.js";

const router = express.Router();

//Defining Routes  
router.route("/").post(registerUser).get(allUsers);
router.post("/login", authUser);

export default router; 