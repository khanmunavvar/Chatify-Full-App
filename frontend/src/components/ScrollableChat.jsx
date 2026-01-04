import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            <span
              className={`rounded-2xl px-4 py-2 max-w-[75%] mb-2 text-sm md:text-base ${
                // if i send the nsg
                m.sender._id === user._id
                  ? "bg-[#BEE3F8] ml-auto rounded-tr-none text-black" 
                  : "bg-[#B9F5D0] mr-auto rounded-tl-none text-black"
              }`}
            >
              {/* Message Content */}
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;