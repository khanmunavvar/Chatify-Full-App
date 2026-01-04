import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    
    // validation for make sure all feilds are fill or not
    if (!email || !password) {
      alert("Please fill all the fields!");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // 2. API Call to Backend
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // 3. Success
      alert("Login Successful! 🎉");
      localStorage.setItem("userInfo", JSON.stringify(data)); // Data save
      setLoading(false);
      navigate("/chats"); // Page redirect

    } catch (error) {
      // 4. Error
      alert("Error: " + error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-800">Welcome Back! 👋</h2>
      
      {/* Email Input */}
      <div className="relative">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none transition-all"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <button 
        onClick={submitHandler}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <button 
        className="text-sm text-red-500 font-semibold hover:underline text-center"
        onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
        }}
      >
        Get Guest Credentials
      </button>
    </div>
  );
};

export default Login;