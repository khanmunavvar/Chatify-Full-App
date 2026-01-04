import React, { useState } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      {/* Main Card Container (Split Layout) */}
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
        
        {/* LEFT SIDE: Branding & Design */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 relative">
          {/* Decorative Circles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

          <h1 className="text-6xl font-bold mb-4 tracking-wide">Chatify</h1>
          <p className="text-xl text-blue-100 text-center">
            Connect. Chat. Share. <br/> 
            <span className="text-sm opacity-80">Real-time conversations made simple.</span>
          </p>
        </div>

        {/* RIGHT SIDE: Form Area */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          {/* Mobile Header (Sirf mobile pe dikhega) */}
          <div className="md:hidden text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Chatify</h1>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-full mb-8">
            <button
              className={`w-1/2 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 0
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 1
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="transition-all duration-500">
            {activeTab === 0 ? <Login /> : <Signup />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Homepage;