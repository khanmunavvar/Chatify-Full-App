import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/User.js";
import Chat from "../models/chatModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  // Destructure content (message text) and chatId from the request body
  const { content, chatId } = req.body;

  // Check if data is missing
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400); // Return if Bad Request error
  }

  // Create a new message object structure
  var newMessage = {
    sender: req.user._id, // The ID of the logged-in user (from auth middleware)
    content: content,     // The actual message text
    chat: chatId,         // The ID of the chat this message belongs to
  };

  try {
    // Step 1: Create/Save the message in the Database
    var message = await Message.create(newMessage);

    // Step 2: Populate data needed for the Frontend
    // We replace the sender ID with the actual Sender Object (only name and pic)
    message = await message.populate("sender", "name pic");
    
    // We replace the chat ID with the actual Chat Object
    message = await message.populate("chat");
    
    //  Deep Populate (Populate User details inside the Chat object)
    // Since 'chat' is now an object, we need to populate the 'users' array inside it
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //  Update the Chat Model
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    // Step 5: Send the final populated message back to the user
    res.json(message);

  } catch (error) {
    // Error Handling
    res.status(400);
    throw new Error(error.message);
  }
});


// 2. Controller to FETCH ALL messages for a chat
export const allMessages = asyncHandler(async (req, res) => {
  try {
    // Step 1: Find all messages where the 'chat' field matches the chatId in the URL params
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email") 
      .populate("chat"); 

    // Step 2: Send the array of messages back as JSON
    res.json(messages);
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});