import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    // alert if all feilds are not fill
    if (!name || !email || !password) {
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

      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );

      alert("Registration Successful! 🎉");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");

    } catch (error) {
      alert("Error: " + error.response.data.message);
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">


      {/* for input feilds */}
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        type="email"
        placeholder="Email Address"
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Choose Password"
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {/* buttons */}
      <button
        onClick={submitHandler}
        disabled={loading}
        className="bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;