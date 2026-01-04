import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Image Logic 
  const userImage =
    user.pic &&
    user.pic !==
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      ? user.pic
      : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`;

  return (
    <>
      {children ? (
        <span onClick={() => setIsOpen(true)}>{children}</span>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          <FaEye />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 flex flex-col items-center relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-3xl font-sans mb-4 text-center">
              {user.name}
            </h2>

            {/* Large Image */}
            <img
              className="rounded-full w-36 h-36 object-cover mb-4 shadow-lg"
              src={userImage}
              alt={user.name}
            />

            {/* Email */}
            <h3 className="text-xl font-sans text-gray-600">
              Email: {user.email}
            </h3>

            {/* Footer */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;