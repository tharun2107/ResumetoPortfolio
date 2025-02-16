import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Send token to backend for verification
      const response = await axios.post("http://localhost:5000/auth/google", {
        token: credential,
      });

      console.log("Server Response:", response.data);

      // Store JWT token & user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(`Welcome, ${response.data.user.name}!`);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login Failed! Please try again.");
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => alert("Login Failed!")}
      />
      <button onClick={handleLogout} style={{ marginTop: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default GoogleLoginButton;
