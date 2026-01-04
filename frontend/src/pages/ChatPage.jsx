import { useState } from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/Extras/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full">
      {/* 1. Navbar */}
      {user && <SideDrawer />}
      
      {/* 2. Main Content (Chat List + Chat Box) */}
      <div className="flex justify-between w-full h-[91.5vh] p-3">
        
        {/* Left Side: My Chats */}
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}

        {/* Right Side: Chat Box */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        
      </div>
    </div>
  );
};

export default ChatPage;