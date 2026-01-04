import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./Extras/UpdateGroupChatModal";
import ProfileModal from "./Extras/ProfileModal";
import io from "socket.io-client";

const ENDPOINT = "https://chatify-backend-munavvar.onrender.com"; 
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // Accessing Global State
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  // Helper functions for sender details
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  // --- 1. Socket.io Initialization ---
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  // --- 2. Fetch Messages from Backend ---
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      // Join the specific chat room
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the Messages");
      setLoading(false);
    }
  };

  // --- 3. Send Message Handler ---
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage(""); // Clear input field
        
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        // Emit new message to server
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message");
      }
    }
  };

  // Fetch messages whenever a new chat is selected
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // --- 4. Real-time Message Listener ---
  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      // Logic: If chat is not open or user is in another chat
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Add to notification list if not already present
        if (!notification.some((n) => n._id === newMessageRecieved._id)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain); // Refresh chat list in sidebar
        }
      } else {
        // Append new message to current chat window
        setMessages([...messages, newMessageRecieved]);
      }
    };

    socket.on("message received", handleMessageReceived);

    // Cleanup function to prevent duplicate listeners
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  });

  return (
    <>
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="text-xl md:text-2xl pb-3 px-2 w-full font-sans flex items-center justify-between border-b border-gray-200 bg-white">
            <button
              className="md:hidden mr-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeft />
            </button>

            <span className="font-bold text-gray-800">
              {!selectedChat.isGroupChat ? (
                getSender(user, selectedChat.users)
              ) : (
                selectedChat.chatName.toUpperCase()
              )}
            </span>
            <div>
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex flex-col justify-between p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-hidden mt-3 shadow-inner">
            <div className="flex flex-col overflow-y-auto w-full h-full scrollbar-hide">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="flex flex-col justify-end min-h-full">
                  <ScrollableChat messages={messages} />
                </div>
              )}
            </div>

            {/* Input Field */}
            <input
              className="w-full bg-white p-3 mt-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              placeholder="Enter a message.."
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyDown={sendMessage}
            />
          </div>
        </>
      ) : (
        // Welcome Screen
        <div className="flex items-center justify-center h-full flex-col">
          <p className="text-3xl pb-3 font-sans text-gray-400 font-bold">
            Chatify
          </p>
          <p className="text-gray-500">Click on a user to start chatting</p>
        </div>
      )}
    </>
  );
};

export default SingleChat;