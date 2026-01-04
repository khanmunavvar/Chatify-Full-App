import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { accessChat, fetchChats, createGroupChat } from "../controllers/chatControllers.js";

const router = express.Router();

// Existing route (access Single Chat)
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats); //fetch chat

router.route("/group").post(protect, createGroupChat);//create groupchat 

export default router;