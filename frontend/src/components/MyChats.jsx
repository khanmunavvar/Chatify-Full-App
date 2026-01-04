import React from 'react';
import GroupChatModal from "./Extras/GroupChatModal";
import { FaPlus } from "react-icons/fa";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  return (
    <div className={`flex flex-col p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-200 ${selectedChat ? "hidden md:flex" : "flex"}`}>
    <div className="pb-3 px-3 text-2xl font-sans flex justify-between items-center">
  My Chats

  
  <GroupChatModal>
    <button className="flex items-center text-sm md:text-base bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition">
      New Group Chat <FaPlus className="ml-2" />
    </button>
  </GroupChatModal>
</div>

      <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-scroll">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg mb-2 ${
                  selectedChat === chat ? "bg-[#38B2AC] text-white" : "bg-[#E8E8E8] text-black"
                }`}
                key={chat._id}
              >
                <p>
                  
                  {!chat.isGroupChat
                    ? chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MyChats;