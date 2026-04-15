import React, { useState } from "react";

function AdminLogin({ onAdminLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      onAdminLogin();
    } else {
      setMessage("❌ Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {message && (
          <div className="mb-4 text-center p-2 bg-red-100 text-red-700 rounded">
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;