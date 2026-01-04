import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider"; 
import axios from "axios";
import { toast } from "react-toastify"; 
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  // Helper function to close modal and reset state
  const closeModal = () => {
    setIsOpen(false);
    setSearchResults([]);
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
  };

  // User Search 
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  //  Add User to Selection 
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  //  Remove User from Selection 
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // Create Chat Button
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.warning("Please fill all the fields (Name & select users)");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]); // Update global chat list
      closeModal(); // Close modal on success
      
      
      toast.success("New Group Chat Created!");
      
    } catch (error) {
      toast.error("Failed to Create the Chat!");
     
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 flex flex-col items-center">
            
            {/* Header */}
            <div className="flex justify-between w-full mb-4">
              <h2 className="text-3xl font-sans">Create Group Chat</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col w-full">
              
              {/* Input: Group Name */}
              <input
                className="mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />

              {/* Input: User Search */}
              <input
                className="mb-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                placeholder="Add Users eg: John, Piyush, Jane"
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* Selected Users (Purple Badges) */}
              <div className="flex w-full flex-wrap mb-2">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              {/* Search Results List */}
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                searchResults
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </div>

            {/* Footer Button */}
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full font-bold shadow-md"
            >
              Create Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;