import React from "react";
import { FaTimes } from "react-icons/fa";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      className="px-2 py-1 rounded-lg m-1 mb-2 bg-purple-500 text-white cursor-pointer flex items-center text-sm"
      onClick={handleFunction}
    >
      {user.name}
      <FaTimes className="pl-1 text-lg" />
    </div>
  );
};

export default UserBadgeItem;