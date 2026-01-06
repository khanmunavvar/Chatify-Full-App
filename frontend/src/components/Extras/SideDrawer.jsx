import React, { useState, useRef, useEffect } from "react"; // 1. Imported useRef and useEffect
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { toast } from "react-toastify";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // UI State Handlers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // 2. Created Refs for "Click Outside" logic
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  // 3. The "Click Outside" Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If Notification Menu is open AND click is NOT inside the notification container
      if (
        isNotifOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }

      // If User Menu is open AND click is NOT inside the user menu container
      if (
        isMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen, isMenuOpen]);


  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat");
      setLoadingChat(false);
    }
  };

  const userImage =
    user.pic &&
    user.pic !==
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      ? user.pic
      : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`;

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full p-2 border-b-4 border-gray-100">
        
        {/* Search Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
        >
          <FaSearch />
          <span className="hidden md:inline px-4 font-medium">Search User</span>
        </button>

        {/* Brand Name */}
        <div className="text-2xl font-sans font-bold text-gray-800">
          Chatify
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          
          {/* Notification Menu Container */}
          {/* 4. Attached ref={notifRef} to the container */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className="relative p-2 focus:outline-none"
            >
              <FaBell className="text-xl text-gray-600 hover:text-teal-600 transition" />
              
              {/* Notification Badge */}
              {notification.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {notification.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                {!notification.length && (
                  <div className="p-4 text-gray-500 text-sm text-center">No New Messages</div>
                )}
                
                {notification.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                      setIsNotifOpen(false);
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Menu Container */}
          {/* 5. Attached ref={userMenuRef} to the container */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 bg-gray-100 p-1 pr-2 rounded-lg hover:bg-gray-200 transition"
            >
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userImage}
                alt={user.name}
              />
              <FaChevronDown className="text-xs text-gray-600" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-10">
                <ProfileModal user={user}>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                    My Profile
                  </button>
                </ProfileModal>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Drawer Component */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          <div className="relative bg-white w-80 h-full shadow-2xl flex flex-col p-4 animate-slide-in-left">
            <div className="border-b pb-2 mb-4 text-xl font-bold text-gray-700">
              Search Users
            </div>

            <div className="flex pb-4">
              <input
                className="w-full p-2 border rounded mr-2"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Go
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="text-center mt-4">Loading...</div>
              ) : (
                searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => accessChat(u._id)}
                  />
                ))
              )}
              {loadingChat && (
                <div className="text-center mt-2 text-teal-600">
                  Starting Chat...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;