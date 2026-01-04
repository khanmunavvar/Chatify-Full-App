import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who send the msg
    content: { type: String, trim: true }, // message
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // part of which chat 
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;