import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-[#E8E8E8] hover:bg-[#38B2AC] hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg transition-colors"
    >
      <div className="mr-2 cursor-pointer">
        <img
          className="rounded-full w-8 h-8"
          src={user.pic}
          alt={user.name}
        />
      </div>
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;