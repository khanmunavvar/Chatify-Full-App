import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors"; // <--- 1. IMPORT ADDED
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();
const app = express();

// <--- 2. MIDDLEWARE ADDED (Allow connection from anywhere)
app.use(cors({
    origin: "*" 
}));

app.use(express.json()); // for accept json data

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

// --- Routes ---
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// --- Server Start ---
const server = app.listen(
  PORT,
  console.log(`Server Started on PORT ${PORT}`)
);

// Socket.io Setup
const io = new Server(server, {
  pingTimeout: 60000, // before closing server wait for 60 sec
  cors: {
    origin: "*", // <--- 3. CHANGED (Localhost ki jagah '*' kar diya taaki Vercel se connect ho sake)
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // 1. User setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User Joined Room:", userData._id);
    socket.emit("connected");
  });

  // 2. join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Chat Room: " + room);
  });

  // 3. Typing Indicator
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // 4. New Message Handling
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  // 5. Cleanup (Disconnect)
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});