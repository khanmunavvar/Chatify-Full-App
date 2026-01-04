import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  // 1. Remove User / Leave Group
  const handleRemove = async (user1) => {
    // only admin can remove
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only Admin can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // closed chat if admin exit/remove himsellf
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  // 2. Add User
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only Admin can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  // 3. Rename Group
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
      setGroupChatName(""); // Input clear
      toast.success("Group Name Updated!");
    } catch (error) {
      toast.error("Error Occured!");
      setRenameloading(false);
    }
  };

  // 4. Search User
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
        <FaEye />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 flex flex-col items-center">
            
            {/* Header */}
            <div className="flex justify-between w-full mb-4">
               <h2 className="text-2xl font-sans">{selectedChat.chatName}</h2>
               <button onClick={() => setIsOpen(false)} className="text-gray-500">✕</button>
            </div>

            <div className="w-full flex flex-col">
              
              {/* Users Badges (Remove Logic) */}
              <div className="flex flex-wrap w-full pb-3">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>

              {/* Rename Input */}
              <div className="flex mb-3">
                <input
                  className="w-full p-2 border rounded mr-2"
                  placeholder="Rename Chat"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  onClick={handleRename}
                  className="bg-teal-500 text-white px-4 rounded hover:bg-teal-600 whitespace-nowrap"
                >
                  {renameloading ? "..." : "Update"}
                </button>
              </div>

              {/* Add User Input */}
              <input
                 className="w-full p-2 border rounded mb-2"
                 placeholder="Add User to group"
                 onChange={(e) => handleSearch(e.target.value)}
              />

              {/* Search Results */}
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}

              {/* Leave Button */}
              <button
                onClick={() => handleRemove(user)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition self-end"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;