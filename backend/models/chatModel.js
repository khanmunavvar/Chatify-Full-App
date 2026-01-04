import mongoose from "mongoose";

const chatModel = mongoose.Schema(
  {
    // The name of the chat groupchat/singlechat
    chatName: { type: String, trim: true },

    // tells it's groupchat or single chat
    isGroupChat: { type: Boolean, default: false },

    // Array of users participating in this chat
    // It will store the 'User' IDs (e.g., [User_A_ID, User_B_ID])
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the "User" model
      },
    ],

    // Stores the ID of the very last message sent in this chat
   
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // References the "Message" model
    },

    // Tracks the admin of the group (only applicable if isGroupChat is true)

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // Mongoose will automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

export default Chat;